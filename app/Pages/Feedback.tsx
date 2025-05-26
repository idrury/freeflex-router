import { useState } from "react";
import { insertError, insertFeedback } from "../Functions/DBAccess";
import ErrorLabel from "../Elements/ErrorLabel";
import spinners from "react-spinners";
import SavedModal from "../Elements/SavedModal";
import PageHeader from "../Elements/PageHeader";
import React from "react";
import { SavedModalType } from "../assets/Types";

interface FeedbackProps {
  menuVisible: boolean;
  inShrink: boolean;
}

export default function Feedback({
  menuVisible,
  inShrink,
}: FeedbackProps) {
  const [category, setCategory] = useState<string | null>();
  const [feedback, setFeedback] = useState<string | null>();

  const [savedModalData, setSavedModalData] = useState<SavedModalType>({
    visible: false,
    header: undefined,
    body: undefined,
  });
  const [validation, setValidation] = useState<{active: null|string, value: null | string}>({
    active: null,
    value: null,
  });
  const [loading, setLoading] = useState(false);

  async function submitFeedback(e) {
    e.preventDefault();

    if (!category) {
      setValidation({
        active: "category",
        value: "Please select a category",
      });
      return;
    }

    if (!feedback) {
      setValidation({
        active: "feedback",
        value: "Please enter some feedback",
      });
      return;
    }

    setLoading(true);

    // Insert to the database
    try {
      await insertFeedback(category, feedback);
    } catch (error) {
      insertError(
        error,
       "Feedback:insertFeedback",
        { category, feedback },
        null,
        true
      );
      setValidation({
        active: "bottom",
        value:
          "There was an error uploading your feedback. Refresh the page and try again.",
      });

      setLoading(false);
      return false;
    }

    setSavedModalData({
      visible: true,
      header: "Feedback submitted successfully",
      body: undefined,
    });
    setCategory(null);
    setFeedback(null);
    setLoading(false);

    return true;
  }
  return (
    <div className="centerContainer mediumFade">
      <SavedModal
        visible={savedModalData.visible}
        setVisible={() =>
          setSavedModalData({
            visible: false,
            header: undefined,
            body: undefined,
          })
        }
        header={savedModalData.header}
        body={savedModalData.body}
      />

      <PageHeader
        text="Feedback"
        icon="chatbubble-sharp"
        menuVisible={menuVisible}
        inShrink={inShrink}
      />

      <p className="p0">
        Found a bug, something you don't like or just got a cool idea?
        Let us know about it so we can add it to the site!
      </p>
      <br />
      <form onSubmit={submitFeedback}>
        <div className="m1 p2 boxedOutline boxedDark">
          <h2 className="textLeft m1">This is...</h2>
          <div>
            <button
              className={
                category == "issue" ? "accentButton" : undefined
              }
              type="button"
              onClick={() => setCategory("issue")}
            >
              An Issue
            </button>
            <button
              className={
                category == "idea" ? "accentButton" : undefined
              }
              type="button"
              onClick={() => setCategory("idea")}
            >
              An idea
            </button>
            <button
              className={
                category == "other" ? "accentButton" : undefined
              }
              type="button"
              onClick={() => setCategory("other")}
            >
              Other
            </button>
          </div>
          <ErrorLabel
            active={validation.active == "category"}
            text={validation.value}
          />
          <textarea
            wrap="off"
            className="fifty m2"
            style={{ maxWidth: "90%" }}
            onChange={(e) => setFeedback(e.target.value)}
            value={feedback || ""}
            placeholder="''...that stupid button won't work!''"
          />
          <ErrorLabel
            active={validation.active == "feedback"}
            text={validation.value}
          />
          <button
            className="accentButton"
            type="submit"
            style={{ width: 200, height: 40 }}
          >
            {loading ? (
              <spinners.BeatLoader color="var(--background)" size={11} />
            ) : (
              "Submit Feedback"
            )}
          </button>
          <ErrorLabel
            active={validation.active == "bottom"}
            text={validation.value}
          />
        </div>
      </form>
    </div>
  );
}
