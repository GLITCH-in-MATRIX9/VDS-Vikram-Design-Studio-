import React, { useState, useEffect, useRef } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import axios from "axios";

// API base (Vite env or fallback)
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const initialContacts = [
  {
    id: 1,
    city: "Guwahati",
    phone_numbers: ["+91 70990 50180", "+91 97060 77180"],
    email_addresses: ["info@vikramdesignstudio.com"],
    address:
      "Aastha Plaza, B2, 2nd Floor, Bora Service, opp. to SB Deorah College, Guwahati, Assam 781007",
    google_maps_iframe_src:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.8615137856277!2d91.76120077555963!3d26.168639277098546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a59536d34694d%3A0x5dd7c3fa56503ad1!2sVikram%20Design%20Studio!5e0!3m2!1sen!2sin!4v1757089159991!5m2!1sen!2sin",
  },
  {
    id: 2,
    city: "Kolkata",
    phone_numbers: ["+91 70990 50180", "+91 97060 77180"],
    email_addresses: ["info@vikramdesignstudio.com"],
    address:
      "12th Floor, Unit 12W2, Mani Casadona, Action Area I, IIF, Newtown, Kolkata, West Bengal 700156",
    google_maps_iframe_src:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.829030314799!2d88.48329621064381!3d22.585496932412404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a020b3afc09b2fd%3A0xc49d34fd7a2d99f3!2sVikram%20Design%20Studio%20-%20Architecture%20%7C%20Interior%20%7C%20Landscape!5e0!3m2!1sen!2sin!4v1757093764341!5m2!1sen!2sin",
  },
];

const ContactContentUpdates = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const [editingId, setEditingId] = useState(null);
  const topRef = useRef(null);
  const [newContact, setNewContact] = useState({
    city: "",
    phone_numbers: [""],
    email_addresses: [""],
    address: "",
    google_maps_iframe_src: "",
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/content/contact`);
        const data = res.data;
        if (data && Array.isArray(data.contacts)) setContacts(data.contacts);
      } catch (err) {
        // console.error("Failed to load contact content", err);
      }
    };

    fetchContacts();
  }, []);

  const persistAll = async (updated) => {
    // include Authorization header from localStorage as a fallback if axios defaults aren't set
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const payload = {
      page: "CONTACT",
      content: updated,
      lastModifiedBy: "admin",
    };

    // console.debug("Persisting contact content:", payload);

    await axios.post(`${API_BASE}/content`, payload, { headers });
  };

  const handleSave = async () => {
    if (!newContact.city || !newContact.address) return;

    if (editingId) {
      const updated = contacts.map((c) =>
        c.id === editingId ? { ...c, ...newContact } : c
      );
      setContacts(updated);
      setEditingId(null);
      try {
        await persistAll(updated);
        alert("Contact updated");
      } catch (err) {
        // console.error("Save failed:", err?.response || err);
        const status = err?.response?.status;
        const serverMsg =
          err?.response?.data?.message || err?.response?.data?.error;
        alert(
          `Save failed${status ? ` (HTTP ${status})` : ""}${
            serverMsg
              ? `: ${serverMsg}`
              : ". Check console/network for details."
          }`
        );
      }
    } else {
      const id = Math.max(0, ...contacts.map((c) => c.id)) + 1;
      const updated = [...contacts, { id, ...newContact }];
      setContacts(updated);
      try {
        await persistAll(updated);
        alert("Contact added");
      } catch (err) {
        // console.error("Save failed:", err?.response || err);
        const status = err?.response?.status;
        const serverMsg =
          err?.response?.data?.message || err?.response?.data?.error;
        alert(
          `Save failed${status ? ` (HTTP ${status})` : ""}${
            serverMsg
              ? `: ${serverMsg}`
              : ". Check console/network for details."
          }`
        );
      }
    }

    setNewContact({
      city: "",
      phone_numbers: [""],
      address: "",
      google_maps_iframe_src: "",
    });
  };

  const handleEdit = (contact) => {
    setEditingId(contact.id);
    setNewContact({
      ...contact,
      phone_numbers: Array.isArray(contact.phone_numbers)
        ? contact.phone_numbers
        : [""],
      email_addresses: Array.isArray(contact.email_addresses)
        ? contact.email_addresses
        : [""],
    });
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = async (id) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    if (editingId === id) setEditingId(null);
    try {
      await persistAll(updated);
      alert("Contact removed");
    } catch (err) {
      // console.error("Delete failed:", err?.response || err);
      const status = err?.response?.status;
      const serverMsg =
        err?.response?.data?.message || err?.response?.data?.error;
      alert(
        `Save failed${status ? ` (HTTP ${status})` : ""}${
          serverMsg ? `: ${serverMsg}` : ". Check console/network for details."
        }`
      );
    }
  };

  const handlePhoneChange = (index, value) => {
    const updated = [...newContact.phone_numbers];
    updated[index] = value;
    setNewContact((prev) => ({ ...prev, phone_numbers: updated }));
  };

  const handleEmailChange = (index, value) => {
    const updated = [...newContact.email_addresses];
    updated[index] = value;
    setNewContact((prev) => ({ ...prev, email_addresses: updated }));
  };

  const addPhoneNumber = () => {
    setNewContact((prev) => ({
      ...prev,
      phone_numbers: [...prev.phone_numbers, ""],
    }));
  };

  const addEmailAddress = () => {
    setNewContact((prev) => ({
      ...prev,
      email_addresses: [...prev.email_addresses, ""],
    }));
  };

  const removePhoneNumber = (index) => {
    setNewContact((prev) => ({
      ...prev,
      phone_numbers: prev.phone_numbers.filter((_, i) => i !== index),
    }));
  };

  const removeEmailAddress = (index) => {
    setNewContact((prev) => ({
      ...prev,
      email_addresses: prev.email_addresses.filter((_, i) => i !== index),
    }));
  };

  return (
    <div ref={topRef} className="p-6 bg-[#f3efee] space-y-8">
      {/* Title */}
      <h2 className="text-2xl font-bold text-[#3E3C3C]">
        Contact Page Updates
      </h2>

      {/* Add / Edit Form */}
      <div className="bg-white border rounded p-6 space-y-4">
        <input
          type="text"
          placeholder="City"
          value={newContact.city}
          onChange={(e) =>
            setNewContact((prev) => ({ ...prev, city: e.target.value }))
          }
          className="w-full border p-2 text-sm"
        />

        {/* Phone Numbers */}
        <div className="space-y-2">
          <label className="font-semibold text-[#3E3C3C] text-sm">
            Phone Numbers
          </label>

          {newContact.phone_numbers.map((num, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={num}
                onChange={(e) => handlePhoneChange(idx, e.target.value)}
                className="flex-1 border p-2 text-sm"
              />
              <button
                onClick={() => removePhoneNumber(idx)}
                className="px-3 py-2 bg-gray-200 rounded text-sm"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <button
            onClick={addPhoneNumber}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded text-sm"
          >
            <Plus size={14} /> Add Phone
          </button>
        </div>

        {/* Email Addresses */}
        <div className="space-y-2">
          <label className="font-semibold text-[#3E3C3C] text-sm">
            Email Addresses
          </label>

          {(newContact.email_addresses || [""]).map((email, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(idx, e.target.value)}
                className="flex-1 border p-2 text-sm"
              />
              <button
                onClick={() => removeEmailAddress(idx)}
                className="px-3 py-2 bg-gray-200 rounded text-sm"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <button
            onClick={addEmailAddress}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded text-sm"
          >
            <Plus size={14} /> Add Email
          </button>
        </div>

        <textarea
          placeholder="Address"
          value={newContact.address}
          onChange={(e) =>
            setNewContact((prev) => ({ ...prev, address: e.target.value }))
          }
          className="w-full border p-2 text-sm h-24 resize-none"
        />

        <textarea
          placeholder="Google Maps Iframe Src"
          value={newContact.google_maps_iframe_src}
          onChange={(e) =>
            setNewContact((prev) => ({
              ...prev,
              google_maps_iframe_src: e.target.value,
            }))
          }
          className="w-full border p-2 text-sm h-24 resize-none"
        />

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded text-sm"
          >
            <Plus size={14} />
            {editingId ? "Update Contact" : "Add Contact"}
          </button>

          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setNewContact({
                  city: "",
                  phone_numbers: [""],
                  email_addresses: [""],
                  address: "",
                  google_maps_iframe_src: "",
                });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-300 rounded text-sm"
            >
              <X size={14} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* Existing Contacts */}
      <div className="space-y-4">
        {contacts.map((c) => (
          <div key={c.id} className="bg-white border rounded p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-[#3E3C3C]">{c.city}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="p-2 bg-gray-200 rounded"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 bg-gray-200 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="text-sm text-[#6D6D6D] space-y-1">
              <p className="font-medium text-[#3E3C3C]">Phone Numbers</p>
              <ul className="list-disc list-inside">
                {c.phone_numbers.map((num, i) => (
                  <li key={i}>{num}</li>
                ))}
              </ul>

              {Array.isArray(c.email_addresses) &&
                c.email_addresses.length > 0 && (
                  <>
                    <p className="font-medium text-[#3E3C3C] mt-2">
                      Email Addresses
                    </p>
                    <ul className="list-disc list-inside">
                      {c.email_addresses.map((email, i) => (
                        <li key={i}>{email}</li>
                      ))}
                    </ul>
                  </>
                )}

              <p className="font-medium text-[#3E3C3C] mt-2">Address</p>
              <p>{c.address}</p>

              <p className="font-medium text-[#3E3C3C] mt-2">Google Maps</p>
              <iframe
                src={c.google_maps_iframe_src}
                width="100%"
                height="200"
                className="border rounded"
                loading="lazy"
                title={c.city}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactContentUpdates;
