import React, { useState } from "react";

import FramePeachUI from "./pages/FramePeachUI/FramePeach";
import { PreviewPanel } from "./pages/PreviewPanel/PreviewPanel";


function App(){

    const [previewPanel, setPreviewPanel] = useState(false);

    return ( !previewPanel? <FramePeachUI onClosePreviewPanel={setPreviewPanel} />:<PreviewPanel onClose={setPreviewPanel}/>
    )  
}

export default App;