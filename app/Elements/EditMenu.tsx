import React from "react";
import spinners from "react-spinners";

interface EditMenuProps {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  children;
  width: number;
  height: number;
  isLoading?: boolean;
}

function EditMenu({
  isActive,
  setIsActive,
  children,
  width,
  height,
  isLoading = false,
}: EditMenuProps) {
  function handleMainClick(e) {
    e.stopPropagation();
  }

  if (isActive) {
    return (
      <div>
        {isLoading && (
          <spinners.HashLoader
            className="mediumFade"
            style={{
              position: "fixed",
              left: "50%",
              top: "40%",
              zIndex: 5,
            }}
            color="var(--primaryColor)"
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
          }}
          className="moveableMenuBackground mediumFade"
          onClick={() => setIsActive(false)}
        >
          <div
            className="boxedDark s2"
            style={{ margin: 0, padding: 0 }}
            onClick={(e) => handleMainClick(e)}
          >
            <div
              className="boxedDark"
              style={{
                minWidth: width,
                minHeight: height,
                margin: 0,
                padding: 20,
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default EditMenu;
