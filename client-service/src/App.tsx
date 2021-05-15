import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { Page } from "./features/Page";
import { AppWrapper } from "./features/Wrapper/AppWrapper";

function App() {
  const [visible, setVisible] = useState(true);

  return (
    <AppWrapper>
      {visible && (
        <Page duration={0.3} enter="top" leave="right">
          <div style={{ height: "100%", backgroundColor: "#333" }}>
            <Button
              onClick={() => setVisible(false)}
              variant="contained"
              color="primary"
            >
              Hai how are you
            </Button>
          </div>
        </Page>
      )}
    </AppWrapper>
  );
}

export default App;
