import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/contacts";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
};

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || "Something went wrong. Please try again."
    );
  }

  return result;
}

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function App() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadContacts() {
    setLoading(true);
    setError("");

    try {
      const result = await apiRequest(API_URL);
      setContacts(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return contacts;

    return contacts.filter((contact) =>
      [contact.name, contact.email, contact.phone, contact.company]
        .some((value) => String(value || "").toLowerCase().includes(query))
    );
  }, [contacts, search]);

  function openCreateForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function openEditForm(contact) {
    setForm({
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || "",
      company: contact.company || "",
    });
    setEditingId(contact._id);
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function closeForm() {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    setSaving(true);

    try {
      const isEditing = Boolean(editingId);
      const url = isEditing ? `${API_URL}/${editingId}` : API_URL;

      const result = await apiRequest(url, {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim(),
        }),
      });

      if (isEditing) {
        setContacts((current) =>
          current.map((item) =>
            item._id === editingId ? result.data : item
          )
        );
        setNotice("Contact updated successfully.");
      } else {
        setContacts((current) => [result.data, ...current]);
        setNotice("Contact added successfully.");
      }

      closeForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteContact(contact) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${contact.name}?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await apiRequest(`${API_URL}/${contact._id}`, {
        method: "DELETE",
      });

      setContacts((current) =>
        current.filter((item) => item._id !== contact._id)
      );
      setNotice(`${contact.name} was deleted.`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Contactly home">
          <span className="brand-icon">C</span>
          <span>Contact<span className="brand-light">ly</span></span>
        </a>

        <div className="side-label">WORKSPACE</div>
        <button className="nav-item active" type="button">
          <span className="nav-icon">▦</span>
          Dashboard
        </button>
        <button
          className="nav-item"
          type="button"
          onClick={() => document.getElementById("contacts-section")?.scrollIntoView({ behavior: "smooth" })}
        >
          <span className="nav-icon">♧</span>
          All Contacts
          <span className="nav-count">{contacts.length}</span>
        </button>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <div className="help-symbol">✦</div>
            <strong>Stay connected</strong>
            <p>Keep all your important people organized in one place.</p>
            <button type="button" onClick={openCreateForm}>Add a contact ↗</button>
          </div>
          <div className="profile">
            <div className="profile-avatar">AA</div>
            <div className="profile-text">
              <strong>Administrator</strong>
              <span>Contact Manager</span>
            </div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> Dashboard</div>
          <div className="topbar-right">
            <span className="system-status"><i /> Database connected</span>
            <div className="top-avatar">AA</div>
          </div>
        </header>

        <section className="page-content">
          <div className="welcome-row">
            <div>
              <div className="eyebrow">YOUR PERSONAL WORKSPACE</div>
              <h1>Contact Dashboard</h1>
              <p className="subtitle">Manage your relationships, all in one place.</p>
            </div>
            <button className="primary-button" onClick={openCreateForm} type="button">
              <span>＋</span> Add Contact
            </button>
          </div>

          {error && !modalOpen && (
            <div className="alert alert-error" role="alert">
              <span>!</span>
              <div><strong>Something needs your attention</strong><p>{error}</p></div>
              <button type="button" onClick={() => setError("")} aria-label="Dismiss error">×</button>
            </div>
          )}

          {notice && (
            <div className="alert alert-success" role="status">
              <span>✓</span><p>{notice}</p>
              <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">×</button>
            </div>
          )}

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon purple">♧</span>
                <span className="stat-tag">TOTAL</span>
              </div>
              <div className="stat-number">{loading ? "—" : contacts.length}</div>
              <div className="stat-label">Total Contacts</div>
              <div className="stat-foot">All saved contacts</div>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon green">@</span>
                <span className="stat-tag">EMAIL</span>
              </div>
              <div className="stat-number">
                {loading ? "—" : contacts.filter((c) => c.email).length}
              </div>
              <div className="stat-label">Email Addresses</div>
              <div className="stat-foot">Contacts with email</div>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon orange">▯</span>
                <span className="stat-tag">PHONE</span>
              </div>
              <div className="stat-number">
                {loading ? "—" : contacts.filter((c) => c.phone?.trim()).length}
              </div>
              <div className="stat-label">Phone Numbers</div>
              <div className="stat-foot">Contacts with phone</div>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon blue">▤</span>
                <span className="stat-tag">COMPANY</span>
              </div>
              <div className="stat-number">
                {loading ? "—" : new Set(contacts.map((c) => c.company?.trim()).filter(Boolean)).size}
              </div>
              <div className="stat-label">Organizations</div>
              <div className="stat-foot">Unique companies</div>
            </div>
          </div>

          <section className="contacts-panel" id="contacts-section">
            <div className="panel-heading">
              <div>
                <h2>All Contacts <span className="heading-count">{contacts.length}</span></h2>
                <p>Your saved people and their details.</p>
              </div>
              <button className="outline-button" type="button" onClick={loadContacts}>
                ↻ Refresh
              </button>
            </div>

            <div className="table-toolbar">
              <div className="search-box">
                <span className="search-symbol">⌕</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, email, phone..."
                  aria-label="Search contacts"
                />
                {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search">×</button>}
              </div>
              <span className="results-count">
                Showing <strong>{filteredContacts.length}</strong> of <strong>{contacts.length}</strong>
              </span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>CONTACT</th>
                    <th>COMPANY</th>
                    <th>PHONE</th>
                    <th>EMAIL ADDRESS</th>
                    <th className="actions-heading">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="table-message"><span className="spinner" /> Loading contacts...</td></tr>
                  ) : filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        <div className="empty-state">
                          <div className="empty-icon">{search ? "⌕" : "♧"}</div>
                          <h3>{search ? "No matching contacts" : "Your contact list is empty"}</h3>
                          <p>{search ? "Try another search term." : "Add your first contact to get started."}</p>
                          {!search && <button className="primary-button" onClick={openCreateForm} type="button">＋ Add your first contact</button>}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((contact) => (
                      <tr key={contact._id}>
                        <td>
                          <div className="contact-person">
                            <div className="contact-avatar">{initials(contact.name)}</div>
                            <div className="person-info">
                              <strong>{contact.name}</strong>
                              <span>{contact.email}</span>
                            </div>
                          </div>
                        </td>
                        <td><span className="company-name">{contact.company || "—"}</span></td>
                        <td>{contact.phone || <span className="muted">Not provided</span>}</td>
                        <td><span className="email-text">{contact.email}</span></td>
                        <td>
                          <div className="row-actions">
                            <button className="icon-button edit-button" type="button" onClick={() => openEditForm(contact)} title="Edit contact" aria-label={`Edit ${contact.name}`}>✎</button>
                            <button className="icon-button delete-button" type="button" onClick={() => deleteContact(contact)} title="Delete contact" aria-label={`Delete ${contact.name}`}>⌫</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="panel-footer">
              <span>Contact Manager <span className="footer-dot">•</span> Connected to MongoDB</span>
              <span>{filteredContacts.length} contact{filteredContacts.length === 1 ? "" : "s"} displayed</span>
            </div>
          </section>

          <footer className="page-footer">Made to keep your connections organized. <span>Contactly © 2026</span></footer>
        </section>
      </main>

      {modalOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !saving) closeForm();
        }}>
          <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-header">
              <div>
                <div className="eyebrow">{editingId ? "UPDATE YOUR RECORD" : "GROW YOUR NETWORK"}</div>
                <h2 id="modal-title">{editingId ? "Edit Contact" : "Add New Contact"}</h2>
                <p>Enter the details below to {editingId ? "update this contact." : "save a new contact."}</p>
              </div>
              <button className="modal-close" type="button" onClick={closeForm} disabled={saving} aria-label="Close">×</button>
            </div>

            {error && <div className="alert alert-error modal-alert" role="alert"><span>!</span><p>{error}</p></div>}

            <form onSubmit={handleSubmit}>
              <label className="form-label">
                Full name <span>*</span>
                <input name="name" value={form.name} onChange={updateField} placeholder="e.g. Awais Ahmad" required maxLength="100" autoFocus />
              </label>
              <label className="form-label">
                Email address <span>*</span>
                <input name="email" type="email" value={form.email} onChange={updateField} placeholder="name@example.com" required maxLength="150" />
              </label>
              <div className="form-row">
                <label className="form-label">
                  Phone number
                  <input name="phone" type="tel" value={form.phone} onChange={updateField} placeholder="+92 300 1234567" maxLength="40" />
                </label>
                <label className="form-label">
                  Company
                  <input name="company" value={form.company} onChange={updateField} placeholder="Company name" maxLength="100" />
                </label>
              </div>
              <div className="form-note"><span>*</span> Required fields</div>
              <div className="modal-actions">
                <button className="outline-button" type="button" onClick={closeForm} disabled={saving}>Cancel</button>
                <button className="primary-button" type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Save Changes" : "＋ Create Contact"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
