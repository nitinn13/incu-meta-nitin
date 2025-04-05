import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Apply = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    industry: "",
    fundingStage: "Ideation",
    revenue: "",
    teamSize: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/user/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          revenue: Number(formData.revenue),
          teamSize: Number(formData.teamSize),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Application submitted successfully!");
        // Optional: Reset form
        setFormData({
          email: "",
          password: "",
          name: "",
          industry: "",
          fundingStage: "Ideation",
          revenue: "",
          teamSize: "",
        });
      } else {
        toast.error(data.message || "Application failed");
      }
    } catch (error: any) {
      toast.error("An error occurred while submitting application");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Apply for Incubation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Input
          name="name"
          placeholder="Startup Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          name="industry"
          placeholder="Industry"
          value={formData.industry}
          onChange={handleChange}
          required
        />
        <div>
          <label className="block text-sm mb-1">Funding Stage</label>
          <select
            name="fundingStage"
            value={formData.fundingStage}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="Ideation">Ideation</option>
            <option value="Pre-Seed">Pre-Seed</option>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
            <option value="Series B">Series B</option>
            <option value="Growth">Growth</option>
          </select>
        </div>
        <Input
          name="revenue"
          type="number"
          placeholder="Revenue"
          value={formData.revenue}
          onChange={handleChange}
          required
        />
        <Input
          name="teamSize"
          type="number"
          placeholder="Team Size"
          value={formData.teamSize}
          onChange={handleChange}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Apply"}
        </Button>
      </form>
    </div>
  );
};

export default Apply;
