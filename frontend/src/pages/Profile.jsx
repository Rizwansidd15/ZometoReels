import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./profile.css";
import avatarImg from "../assets/pro.avif";

const Profile = () => {
  const [items, setItems] = useState([]);
  const [preview, setPreview] = useState(null);
  const params = useParams();
  const partnerId = params?.id;

  useEffect(() => {
    async function load() {
      try {
        if (partnerId) {
          // fetch all items then filter by partner id (backend doesn't expose partner-specific endpoint)
          const res = await fetch("http://localhost:3000/api/food", {
            credentials: "include",
          });
          const data = await res.json();
          const list = (data.fooditems || []).filter((f) => {
            if (!f.foodPartner) return false;
            // f.foodPartner may be a string id or an object with _id
            const fp =
              typeof f.foodPartner === "string"
                ? f.foodPartner
                : f.foodPartner._id || f.foodPartner;
            return String(fp) === String(partnerId);
          });
          setItems(list);
        } else {
          const res = await fetch("http://localhost:3000/api/food/mine", {
            credentials: "include",
          });
          const data = await res.json();
          setItems(data.fooditems || []);
        }
      } catch (err) {
        console.error("Failed to load videos", err);
      }
    }
    load();
  }, [partnerId]);

  return (
    <div className="profile-shell">
      <header className="profile-head card">
        <div className="avatar big">
          <img src={avatarImg} alt="" />
        </div>
        <div className="meta">
          <div className="top-row">
            <h3>Testy Food</h3>
            <div className="addr-boxes">
              <div className="addr">address</div>
            </div>
          </div>

          <div className="stats">
            <div>
              <strong>{items.length}</strong>
              <span>Videos</span>
            </div>
            <div>
              <strong>50</strong>
              <span>Total Meals</span>
            </div>
            <div>
              <strong>15k</strong>
              <span>Customers</span>
            </div>
          </div>
        </div>
      </header>

      <div className="divider" />

      <section className="videos-grid">
        {items.map((it) => (
          <div
            key={it._id}
            className="video-card"
            onClick={() => setPreview(it.video)}
          >
            <video src={it.video} muted className="thumb" />
          </div>
        ))}

        {items.length === 0 && <div className="empty">No videos yet</div>}
      </section>

      {preview && (
        <div className="preview-modal" onClick={() => setPreview(null)}>
          <div className="preview-card" onClick={(e) => e.stopPropagation()}>
            <video src={preview} controls autoPlay className="preview-player" />
            <button className="close" onClick={() => setPreview(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
