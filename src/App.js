import "./App.css";
import { useState } from "react";
import { pdfjs } from "react-pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
function App() {
  const [file, setFile] = useState(null);
  const [base64Files, setBase64Files] = useState([]);

  const convertPdfToBase64 = async () => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const pdf = await pdfjs.getDocument({ data: reader.result }).promise;
        const numPages = pdf.numPages;
        const pages = [];
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.0 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport: viewport })
            .promise;
          const base64String = canvas.toDataURL();
          pages.push(base64String);
        }
        setBase64Files(pages);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="App">
      <input
        type="file"
        name=""
        value=""
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={convertPdfToBase64}>convert</button>
    </div>
  );
}

export default App;
