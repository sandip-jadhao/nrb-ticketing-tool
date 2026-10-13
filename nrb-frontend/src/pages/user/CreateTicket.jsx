import { useState, useRef } from "react";
import UserLayout from "../../layouts/UserLayout";
import { createTicket } from "../../services/ticketService";

function CreateTicket() {
  const [ticket, setTicket] = useState({
    title: "",
    description: "",
    priority: "LOW",
  });
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setTicket({
      ...ticket,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // 15MB size limit validation
      if (selectedFile.size > 15 * 1024 * 1024) {
        alert("File size exceeds 15 MB limit. Please select a smaller file.");
        e.target.value = "";
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Build FormData with text fields and file
      const formData = new FormData();
      formData.append("title", ticket.title);
      formData.append("description", ticket.description);
      formData.append("priority", ticket.priority);

      if (file) {
        formData.append("file", file);
      }

      await createTicket(formData);

      alert("Ticket Created Successfully");

      // Reset form fields
      setTicket({
        title: "",
        description: "",
        priority: "LOW",
      });
      handleRemoveFile();
    } catch (error) {
      console.log(error);
      alert("Failed to create ticket");
    }
  };

  return (
    <UserLayout>
      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block mb-2 font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={ticket.title}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                placeholder="Enter ticket title"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Description</label>
              <textarea
                rows="3"
                name="description"
                value={ticket.description}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="Describe your issue"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Priority</label>
              <select
                name="priority"
                value={ticket.priority}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            {/* Attachment File Input */}
            <div>
              <label className="block mb-2 font-medium">
                Attachment{" "}
                <span className="text-xs text-gray-500 font-normal">
                  (Optional - Images, PDF, Excel, Word up to 15MB)
                </span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.xls,.xlsx,.doc,.docx,.txt"
                className="w-full text-sm text-gray-500 border rounded-lg p-2 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
              />

              {file && (
                <div className="mt-2 flex items-center justify-between p-2 bg-gray-50 border rounded-lg text-xs text-gray-700">
                  <span className="truncate">
                    📎 <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-600 font-bold hover:text-red-800 ml-2"
                  >
                    ✕ Remove
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Create Ticket
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
}

export default CreateTicket;