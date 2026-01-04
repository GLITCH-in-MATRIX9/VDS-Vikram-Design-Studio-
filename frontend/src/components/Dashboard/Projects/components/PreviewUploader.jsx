import React from "react";
import { FiUpload } from "react-icons/fi";

const PreviewUploader = ({ previewURL, handlePreviewChange }) => (
  <div className="flex flex-col gap-2 items-center justify-center border p-4 rounded border-[#C9BEB8]">
    <p className="text-xs text-gray-400 mb-2 text-center">
      ⚠️ Files must not be greater than 900 KB.
    </p>
    <label
      htmlFor="preview-upload"
      className="flex items-center gap-2 px-4 py-2 bg-[#722F37] text-white rounded-md cursor-pointer hover:bg-[#632932] transition"
    >
      <FiUpload />
      <span className="text-sm font-medium">Upload Preview</span>
      <input
        id="preview-upload"
        type="file"
        accept="image/*,.gif"
        onChange={handlePreviewChange}
        className="hidden"
      />
    </label>
    {previewURL && (
      <img
        src={previewURL}
        alt="Preview"
        className="w-auto h-68 object-cover rounded mt-2"
      />
    )}
  </div>
);

export default PreviewUploader;
