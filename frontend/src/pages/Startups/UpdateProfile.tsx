import React, { useState } from "react";
import axios from "axios";

export default function UpdateProfile() {
  const [formData, setFormData] = useState({
    revenue: "",
    teamSize: "",
    founders: [{ name: "", email: "" }],
    businessSummary: "",
    innovationProof: "",
    pitchDeckURL: "",
    previousFunding: [{ round: "", amount: "", investor: "" }],
    documents: [{ type: "", url: "" }]
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFounderChange = (index: number, field: string, value: string) => {
    const updated = [...formData.founders];
    updated[index][field] = value;
    setFormData({ ...formData, founders: updated });
  };

  const handleFundingChange = (index: number, field: string, value: any) => {
    const updated = [...formData.previousFunding];
    updated[index][field] = value;
    setFormData({ ...formData, previousFunding: updated });
  };

  const handleDocumentChange = (index: number, field: string, value: string) => {
    const updated = [...formData.documents];
    updated[index][field] = value;
    setFormData({ ...formData, documents: updated });
  };

  const submitForm = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:3000/api/user/update",
        {
          ...formData,
          revenue: formData.revenue ? Number(formData.revenue) : undefined,
          teamSize: formData.teamSize ? Number(formData.teamSize) : undefined,
          previousFunding: formData.previousFunding.map((f) => ({
            ...f,
            amount: f.amount ? Number(f.amount) : undefined
          }))
        },
        {
          headers: { token }
        }
      );

      alert("Profile updated successfully!");
      console.log(response.data);
    } catch (err: any) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Startup Profile</h1>

      <div className="grid gap-4">
        <input className="border p-2" name="revenue" placeholder="Revenue" value={formData.revenue} onChange={handleChange} />
        <input className="border p-2" name="teamSize" placeholder="Team Size" value={formData.teamSize} onChange={handleChange} />

        <textarea className="border p-2" name="businessSummary" placeholder="Business Summary" value={formData.businessSummary} onChange={handleChange} />

        <textarea className="border p-2" name="innovationProof" placeholder="Innovation Proof" value={formData.innovationProof} onChange={handleChange} />

        <input className="border p-2" name="pitchDeckURL" placeholder="Pitch Deck URL" value={formData.pitchDeckURL} onChange={handleChange} />

        {/* Founders */}
        <div>
          <h2 className="font-semibold">Founders</h2>
          {formData.founders.map((f, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 mb-2">
              <input className="border p-2" placeholder="Name" value={f.name} onChange={(e) => handleFounderChange(i, "name", e.target.value)} />
              <input className="border p-2" placeholder="Email" value={f.email} onChange={(e) => handleFounderChange(i, "email", e.target.value)} />
            </div>
          ))}
        </div>

        {/* Funding */}
        <div>
          <h2 className="font-semibold">Previous Funding</h2>
          {formData.previousFunding.map((f, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 mb-2">
              <input className="border p-2" placeholder="Round" value={f.round} onChange={(e) => handleFundingChange(i, "round", e.target.value)} />
              <input className="border p-2" placeholder="Amount" value={f.amount} onChange={(e) => handleFundingChange(i, "amount", e.target.value)} />
              <input className="border p-2" placeholder="Investor" value={f.investor} onChange={(e) => handleFundingChange(i, "investor", e.target.value)} />
            </div>
          ))}
        </div>

        {/* Documents */}
        <div>
          <h2 className="font-semibold">Documents</h2>
          {formData.documents.map((d, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 mb-2">
              <input className="border p-2" placeholder="Type" value={d.type} onChange={(e) => handleDocumentChange(i, "type", e.target.value)} />
              <input className="border p-2" placeholder="Document URL" value={d.url} onChange={(e) => handleDocumentChange(i, "url", e.target.value)} />
            </div>
          ))}
        </div>

        <button onClick={submitForm} className="bg-blue-600 text-white px-4 py-2 rounded">Update Profile</button>
      </div>
    </div>
  );
}