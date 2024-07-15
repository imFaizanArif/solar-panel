import React from "react";
import ReactDOM from "react-dom/client";
import SettingsProvider from "@/contexts/settingsContext";
import { CustomProvider } from 'rsuite';
import App from "./App"; // third-party library css

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "nprogress/nprogress.css";
import "react-quill/dist/quill.snow.css";
import "simplebar-react/dist/simplebar.min.css";
import "pure-react-carousel/dist/react-carousel.es.css";
import 'rsuite/dist/rsuite.min.css'; 
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<React.StrictMode>
    <SettingsProvider>
    <CustomProvider theme="light">
      <App />
   </CustomProvider>
    </SettingsProvider>
  </React.StrictMode>); // // https://github.com/atlassian/react-beautiful-dnd/issues/2407
// root.render(
//   <SettingsProvider>
//     <App />
//   </SettingsProvider>
// );