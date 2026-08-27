"use client";

import { useState, useEffect } from "react";
import { X, Ruler } from "lucide-react";
import "@/styles/size-guide-modal.css";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export default function SizeGuideModal({ isOpen, onClose, category }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"in" | "cm">("in");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeTableInches = [
    { size: "S", chest: "36 - 38", waist: "29 - 31", hips: "36 - 38", length: "27.5" },
    { size: "M", chest: "39 - 41", waist: "32 - 34", hips: "39 - 41", length: "28.5" },
    { size: "L", chest: "42 - 44", waist: "35 - 37", hips: "42 - 44", length: "29.5" },
    { size: "XL", chest: "45 - 47", waist: "38 - 40", hips: "45 - 47", length: "30.5" },
  ];

  const sizeTableCm = [
    { size: "S", chest: "91 - 96", waist: "74 - 79", hips: "91 - 96", length: "70" },
    { size: "M", chest: "99 - 104", waist: "81 - 86", hips: "99 - 104", length: "72" },
    { size: "L", chest: "107 - 112", waist: "89 - 94", hips: "107 - 112", length: "75" },
    { size: "XL", chest: "114 - 119", waist: "96 - 102", hips: "114 - 119", length: "77" },
  ];

  const tableData = unit === "in" ? sizeTableInches : sizeTableCm;

  return (
    <div className="al-modal-overlay" onClick={onClose}>
      <div
        className="al-size-guide-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
      >
        <div className="al-size-guide-header">
          <div className="al-size-title-group">
            <Ruler size={20} className="al-ruler-icon" />
            <h3 id="size-guide-title">Size & Fit Guide</h3>
          </div>
          <button onClick={onClose} aria-label="Close size guide" className="al-modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="al-size-guide-body">
          <p className="al-size-intro">
            Measurements refer to body size, not garment dimensions. If you are between sizes, we recommend sizing up for a relaxed fit.
          </p>

          {/* Unit Toggle */}
          <div className="al-unit-toggle-row">
            <span className="al-unit-label">Unit of measurement:</span>
            <div className="al-unit-pill-toggle">
              <button
                type="button"
                className={`al-unit-btn ${unit === "in" ? "active" : ""}`}
                onClick={() => setUnit("in")}
              >
                Inches (in)
              </button>
              <button
                type="button"
                className={`al-unit-btn ${unit === "cm" ? "active" : ""}`}
                onClick={() => setUnit("cm")}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="al-size-table-wrap">
            <table className="al-size-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest ({unit})</th>
                  <th>Waist ({unit})</th>
                  <th>Hips ({unit})</th>
                  <th>Length ({unit})</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.size}>
                    <td className="al-size-highlight">{row.size}</td>
                    <td>{row.chest}</td>
                    <td>{row.waist}</td>
                    <td>{row.hips}</td>
                    <td>{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to Measure Tip */}
          <div className="al-how-to-measure-box">
            <h4>How to Measure</h4>
            <ul>
              <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the measuring tape horizontal.</li>
              <li><strong>Waist:</strong> Measure around the narrowest part (typically where your body bends side to side).</li>
              <li><strong>Hips:</strong> Measure around the fullest part of your hips and seat.</li>
            </ul>
          </div>
        </div>

        <div className="al-size-guide-footer">
          <button type="button" onClick={onClose} className="btn btn-primary al-size-got-it-btn">
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
