import { useState } from "react";
import { uploadToCloudinary } from "./services/cloudinary.service";
import { saveAttachment, getAttachments } from "./services/firestore.service";

interface Attachment {
  id: string;
  fileUrl: string;
  createdAt?: any;
}

function App() {
  const [files, setFiles] = useState<Attachment[]>([]);
  const [selectedFile, setSelectedFile] = useState<Attachment | null>(null);
  const [loading, setLoading] = useState(false);


  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setLoading(true);

      // Subir a Cloudinary
      const url = await uploadToCloudinary(file);

      // Guardar en Firestore
      await saveAttachment(url);

      alert("Archivo subido correctamente 🚀");
      loadFiles(); // refresca lista
    } catch (error) {
      console.error(error);
      alert("Error al subir archivo");
    } finally {
      setLoading(false);
    }
  };


  const loadFiles = async () => {
    const data = await getAttachments();
    setFiles(data as Attachment[]);
  };


  const isPDF = (url: string) => url.toLowerCase().endsWith(".pdf");

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h2>Prueba subida y preview de archivos</h2>

      <input type="file" onChange={handleUpload} />
      {loading && <p>Subiendo...</p>}

      <hr style={{ margin: "30px 0" }} />

      <button onClick={loadFiles}>Cargar archivos</button>

      <ul style={{ marginTop: 20 }}>
        {files.map((file) => (
          <li key={file.id} style={{ marginBottom: 10 }}>
            <button onClick={() => setSelectedFile(file)}>
              Ver archivo
            </button>
          </li>
        ))}
      </ul>

      {selectedFile && (
        <div style={{ marginTop: 30 }}>
          <h3>Previsualización</h3>

          {/* Si es PDF */}
          {isPDF(selectedFile.fileUrl) && (
            <iframe
              src={`${selectedFile.fileUrl}#toolbar=0`}
              width="700"
              height="500"
              style={{ border: "1px solid #ccc" }}
              title="PDF Preview"
            />
          )}

          {/* Si fuera imagen */}
          {!isPDF(selectedFile.fileUrl) && (
            <img
              src={selectedFile.fileUrl}
              alt="Preview"
              style={{ maxWidth: "500px" }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;