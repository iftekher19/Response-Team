// src/pages/Search/SearchDonors.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router";
import useAxios from "../../hooks/useAxios";

// Helper to ensure value is an array
const ensureArray = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "object") {
    if (Array.isArray(v.data)) return v.data;
    if (Array.isArray(v.results)) return v.results;
    if (Array.isArray(v.items)) return v.items;
    if (Array.isArray(v.users)) return v.users;
  }
  return [];
};

// Small contact button (mailto + copy email)
const ContactButtons = ({ email, name }) => {
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      alert("Email copied to clipboard");
    } catch {
      alert("Could not copy email — try manually");
    }
  };

  return (
    <div className="flex gap-2">
      <a href={`mailto:${email}?subject=Blood%20Donation%20Request&body=Hi%20${encodeURIComponent(name)}`} className="btn btn-sm bg-red-600 text-white">Email</a>
      <button onClick={copyEmail} className="btn btn-sm btn-ghost">Copy</button>
    </div>
  );
};

export default function SearchDonors() {
  // loader from route may return array or { districts: [...] }
  const loaderData = useLoaderData();
  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  // form state
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");

  // results & UI state
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  const axiosSecure = useAxios();

  // apply loader data (districts)
  useEffect(() => {
    if (!loaderData) return;
    if (Array.isArray(loaderData)) {
      setDistricts(loaderData);
    } else if (loaderData.districts && Array.isArray(loaderData.districts)) {
      setDistricts(loaderData.districts);
    } else {
      // fallback: if loaderData itself is an object with array in unknown key
      const arr = Object.values(loaderData).find((v) => Array.isArray(v));
      setDistricts(arr || []);
    }
  }, [loaderData]);

  // fetch upazilas.json from public/
  useEffect(() => {
    fetch("/upazilas.json")
      .then((r) => r.json())
      .then((data) => {
        // data expected as array, but tolerate { upazilas: [...] }
        if (Array.isArray(data)) setAllUpazilas(data);
        else if (data.upazilas && Array.isArray(data.upazilas)) setAllUpazilas(data.upazilas);
        else setAllUpazilas([]);
      })
      .catch((err) => {
        console.warn("Could not load /upazilas.json", err);
        setAllUpazilas([]);
      });
  }, []);

  // when district selected, filter upazilas
  useEffect(() => {
    if (!district) {
      setUpazilas([]);
      setUpazila("");
      return;
    }
    // districts file uses .id and .name
    const found = districts.find((d) => d.name === district || d.bn_name === district || String(d.id) === String(district));
    const districtId = found?.id || found?.district_id || null;

    const filtered = allUpazilas.filter((u) => String(u.district_id) === String(districtId) || u.district_name === district || u.district === district);
    setUpazilas(filtered);
    setUpazila(""); // reset upazila selection on district change
  }, [district, districts, allUpazilas]);

  // run search (call backend). This function is safe if backend shape differs.
  const runSearch = async (opts = {}) => {
    setLoading(true);
    setError("");
    setResults([]);
    setPage(1);

    const q = {
      bloodGroup: opts.bloodGroup ?? bloodGroup,
      district: opts.district ?? district,
      upazila: opts.upazila ?? upazila,
    };

    try {
      // MODIFY: change endpoint if your backend uses another route.
      // Example request: GET /users/search?bloodGroup=A%2B&district=Dhaka&upazila=Savar
      const params = new URLSearchParams();
      if (q.bloodGroup) params.append("bloodGroup", q.bloodGroup);
      if (q.district) params.append("district", q.district);
      if (q.upazila) params.append("upazila", q.upazila);

      // If backend not ready, you can build a local fallback: fetch('/mock/donors.json')
      const res = await axiosSecure.get(`/users/search?${params.toString()}`).catch((e) => {
        console.warn("Search API failed:", e?.response?.data || e.message || e);
        // Try fallback to /donors.json in public (if you keep a mock list)
        try {
          return fetch("/donors.json").then((r) => r.ok ? r.json() : null);
        } catch {
          return null;
        }
      });

      // normalize response into array
      const raw = res?.data ?? res;
      const arr = ensureArray(raw);
      setResults(arr);
      if (!arr.length) {
        setError("No donors found for your query.");
      }
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // derived: paginated items
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return results.slice(start, start + PAGE_SIZE);
  }, [results, page]);

  // simple reset function
  const resetFilters = () => {
    setBloodGroup("");
    setDistrict("");
    setUpazila("");
    setResults([]);
    setError("");
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Search Donors</h1>

      {/* Search form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Blood Group</label>
            <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="select select-bordered w-full">
              <option value="">Any</option>
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">District</label>
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className="select select-bordered w-full">
              <option value="">Any</option>
              {districts?.map(d => (
                <option key={d.id || d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upazila</label>
            <select value={upazila} onChange={(e) => setUpazila(e.target.value)} className="select select-bordered w-full" disabled={!upazilas || upazilas.length === 0}>
              <option value="">{upazilas && upazilas.length ? "Any" : "No upazila data"}</option>
              {upazilas?.map(u => <option key={u.id || u.name} value={u.name}>{u.name}</option>)}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button type="button" onClick={() => runSearch()} className="btn bg-red-600 text-white w-full">Search</button>
            <button type="button" onClick={resetFilters} className="btn btn-ghost w-full">Reset</button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        {loading && <div className="p-6 bg-white rounded shadow text-center">Searching...</div>}

        {!loading && error && <div className="p-4 bg-yellow-50 border rounded mb-4 text-sm text-yellow-800">{error}</div>}

        {!loading && !error && !results.length && (
          <div className="p-6 bg-white rounded shadow text-center text-gray-600">No results yet. Try searching donors.</div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {paginated.map((u) => (
                <div key={u._id || u.email || u.id} className="bg-white p-4 rounded shadow flex items-center gap-4">
                  <img
                    src={u.avatar || `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%' height='100%' fill='%23ef4444'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='white'>${encodeURIComponent((u.name||"U").charAt(0).toUpperCase())}</text></svg>`}
                    alt={u.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-red-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{u.name}</h3>
                        <p className="text-sm text-gray-600">{u.email}</p>
                        <p className="text-sm text-gray-600">{u.bloodGroup} • {u.district} {u.upazila ? `• ${u.upazila}` : ""}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{u.status || "active"}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <ContactButtons email={u.email} name={u.name} />
                      {/* optional: add "View profile" button linking to private profile or details */}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">Showing {Math.min((page-1)*PAGE_SIZE+1, results.length)} - {Math.min(page*PAGE_SIZE, results.length)} of {results.length}</div>
              <div className="flex items-center gap-2">
                <button className="btn btn-sm" onClick={() => setPage((p) => Math.max(1, p-1))} disabled={page === 1}>Prev</button>
                <div>{page}</div>
                <button className="btn btn-sm" onClick={() => setPage((p) => (p * PAGE_SIZE < results.length ? p+1 : p))} disabled={page * PAGE_SIZE >= results.length}>Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
