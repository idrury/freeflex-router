import { SetStateAction, useEffect, useState } from "react";
import {
  fetchBusiness,
  updateBusiness,
  updateBusinessLogo,
  uploadBusinessLogo,
  insertBusiness,
  updateProfileAttribute,
  insertError,
} from "../../Functions/DBAccess";
import spinners from "react-spinners";
import Cropper from "react-easy-crop";
import getCroppedImg from "../CropImage";
import IonIcon from "@reacticons/ionicons";
import DeletePopup from "../DeletePopup";
import ErrorLabel from "../ErrorLabel";
import SavedModal from "../SavedModal";
import {
  FFBusiness,
  FFErrorSelector,
  FFProfile,
  SavedModalType,
} from "../../assets/Types";
import React from "react";
import { pause, reRouteTo } from "../../Functions/commonFunctions";

interface BusinessDetailsProps {
  profile: FFProfile;
}

/**
 * This page allows the user to update their business details
 */
export default function ExportBusinessDetails({
  profile,
}: BusinessDetailsProps) {
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [busName, setBusName] = useState<string | null>(null);
  const [abn, setAbn] = useState<string | null>(null);
  const [streetNumber, setStreetNumber] = useState<number | null>(
    null
  );
  const [street, setStreet] = useState<string | null>(null);
  const [suburb, setSuburb] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [postcode, setPostcode] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [bsb, setBsb] = useState<string | null>(null);
  const [accountNum, setAccountNum] = useState<string | null>(null);
  const [payId, setPayId] = useState<string | undefined>(undefined);
  const [accountName, setAccountName] = useState<string | null>();

  const [downloadLogoUrl, setDownloadLogoUrl] = useState<
    string | null
  >();
  const [logoLoading, setLogoLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState<string | null>();
  const [confirmLogoDeleteVisible, setConfirmLogoDeleteVisible] =
    useState(false);

  const [errorText, setErrorText] = useState<FFErrorSelector>({
    field: null,
    value: null,
  });

  const [busLoading, setBusLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedModalData, setSavedModalData] =
    useState<SavedModalType>({
      visible: false,
      header: undefined,
      body: undefined,
      state: "success",
    });
  const [renderedPage, setRenderedPage] = useState<Document>();

  useEffect(() => {
    getBusinessData();
    setRenderedPage(document);
  }, []);

  /**
   * Fetch the business data from the database
   */
  async function getBusinessData() {
    let business: FFBusiness | undefined = undefined;
    try {
      business = await fetchBusiness();
    } catch (error) {
      alert(
        "There was an error finding your business. Contact isaac@freeflex.com.au for support."
      );
    }

    if (business == null) {
      try {
        business = await insertBusiness();
      } catch (error) {
        //alert("Oops. There was an error getting your business. Refresh the page to try again!");
        return;
      }
    }

    // Return if the business has failed to load
    if (!business) return;

    setBusinessId(business.id);
    setBusName(business.name);
    setAbn(business.abn);
    setStreetNumber(business.street_number);
    setStreet(business.street);
    setState(business.state);
    setSuburb(business.suburb);
    setPostcode(business.postcode);
    setEmail(business.email);
    setPhone(business.phone);
    setBsb(business.bsb_num);
    setAccountNum(business.account_num);
    setPayId(business.pay_id);
    setDownloadLogoUrl(business.logo);
    setCroppedImage(business.logo);
    setAccountName(business.account_name);
    setBusLoading(false);
    return;
  }

  /**
   * Update the users business details in the database
   */
  async function updateBusinessDetails(event) {
    event.preventDefault();

    setSaving(true);

    // Validate fields
    if (!busName) {
      onInvalidField("busName", "Please enter a valid name");
      return;
    }
    if (!email) {
      onInvalidField("email", "Please enter a valid email address");
      return;
    }
    if (!abn || abn.length != 11 || abn.length < 0) {
      onInvalidField("abn", "A valid ABN number is 11 digits long");
      return;
    }
    if (!streetNumber || streetNumber < 0) {
      onInvalidField("streetNumber", "Enter a valid street number");
      return;
    }
    if (!street) {
      onInvalidField("street", "Enter a street name");
      return;
    }
    if (!suburb) {
      onInvalidField("suburb", "Enter a suburb");
      return;
    }
    if (!state) {
      onInvalidField("state", "Enter a state");
      return;
    }
    if (!postcode || postcode?.length < 0) {
      onInvalidField("postcode", "Enter a valid postcode");
      return;
    }
    if (!bsb || bsb.length != 6 || bsb.length < 0) {
      onInvalidField("bsb", "BSB must be 6 numbers!");
      return;
    }
    if (
      !accountNum ||
      accountNum.length > 10 ||
      accountNum.length <= 0
    ) {
      onInvalidField(
        "accountNum",
        "A valid Australian bank number is 6 - 10 numbers"
      );
      return;
    }

    // Update the user's business details if all fields are valid
    try {
      await updateBusiness(
        businessId,
        busName,
        abn,
        streetNumber,
        street,
        suburb,
        state,
        postcode,
        email,
        phone,
        accountName,
        accountNum,
        payId,
        bsb
      );
    } catch (error) {
      setSavedModalData({
        visible: true,
        header: "Sorry! We've encountered an issue",
        body: "Contact isaac@freeflex.com.au for support!",
        state: "fail",
      });
      return;
    }

    setSavedModalData({
      visible: true,
      header: "Business details saved!",
      state: "success",
    });

    // Complete business details and show success message
    if (!profile.default_settings.business_details_exist) {
      try {
        await updateProfileAttribute(profile.id, "default_settings", {
          ...profile.default_settings,
          business_details_exist: true,
        });
      } catch (error) {
        await insertError(
          error,
          "BusinessDetails:updateProfileAttribute",
          { profile }
        );
      }
      await pause(1000);
      reRouteTo("home");
    }
  }

  /**
   * Show an error message if a field is invalid
   * @param field The field to show the message for
   * @param message The message to show
   */
  function onInvalidField(
    field: string | null,
    message: string | null
  ) {
    setErrorText({
      field: field,
      value: message,
    });
    setSavedModalData({
      visible: true,
      header: "Form not complete",
      body: message || undefined,
      state: "fail",
    });
  }

  function updateBSB(val) {
    setSaving(false);
    setErrorText({ field: null, value: null });

    if (val.length <= 6) {
      setBsb(val);
    }
    return;
  }

  function updateAccName(val) {
    setSaving(false);
    setErrorText({ field: null, value: null });

    setAccountName(val);

    return;
  }

  function updateAcc(val) {
    setSaving(false);
    setErrorText({ field: null, value: null });

    if (val.length <= 10) {
      setAccountNum(val);
    }
    return;
  }

  function updateABN(val) {
    setSaving(false);
    setErrorText({ field: null, value: null });

    if (val.length <= 11) {
      setAbn(val);
    }
    return;
  }

  function updatePostcode(val) {
    setSaving(false);
    setErrorText({ field: null, value: null });

    if (val.length <= 4) {
      setPostcode(val);
    }
    return;
  }

  /**
   * Update any text field that doesn't need special validation
   * @param func The set state function to use
   * @param val The value to set it to
   * @returns
   */
  function updateText(
    setState: (val) => SetStateAction<any>,
    val: string
  ) {
    setSaving(false);
    setErrorText({ field: null, value: null });
    setState(val);
    return;
  }

  /**
   * Handle a user uploading a file from their file system, and create a new
   * file in supabase object storage
   * @param file The file to upload
   * @param saveBusiness If true, save the logo to the business
   * @returns
   */
  async function addFile(file: File | null, saveBusiness = false) {
    let res: string;

    if (!file) return;

    if (file.size > 10000000) {
      alert(
        "Sorry! That file is too big. Your logo must be smaller than 10MB"
      );
      return;
    }

    // Update state vars
    setLogoLoading(true);
    setCroppedImage(null);

    // Upload image to the server
    try {
      res = await uploadBusinessLogo(profile.id, businessId, file);

      setLogoLoading(false);
      setDownloadLogoUrl(res);

      if (saveBusiness == true)
        await updateBusinessLogo(businessId, res);
      setErrorText({ field: null, value: null });
      return res;
    } catch (error) {
      setErrorText({
        field: "end",
        value:
          "Oops! We've encountered an unknown error while attempting to upload that file.\nTry again in a few moments.",
      });
      return null;
    }
  }

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  /**
   * Handle cropping an image to 1 x 1 format
   */
  async function createCroppedImage() {
    try {
      const croppedImage = (await getCroppedImg(
        downloadLogoUrl,
        croppedAreaPixels,
        renderedPage
      )) as File;
      let url = await addFile(croppedImage, true);
      setCroppedImage(url);
    } catch (e) {
      alert(e.message);
      return;
    }
  }

  /**
   * Delete a user's logo from their account
   */
  async function removeLogo() {
    let res = updateBusinessLogo(businessId, null);

    if (!res) {
      alert("An unkown error has occured");
      return;
    }

    setDownloadLogoUrl(null);
    setCroppedImage(null);
    setConfirmLogoDeleteVisible(false);
  }

  return (
    <div className="centerContainer hundred ml1 mr1">
      <DeletePopup
        active={confirmLogoDeleteVisible}
        onCancel={() => setConfirmLogoDeleteVisible(false)}
        onDelete={removeLogo}
        type="logo"
      />
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
        state={savedModalData.state}
      />
      {busLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "100px",
          }}
        >
          {" "}
          <spinners.HashLoader
            className="loader mediumFade"
            color="var(--primaryColor)"
          />
        </div>
      ) : (
        <div className="mediumFade">
          <div className="leftRow middle m0 ml2 mt2">
            <IonIcon
              name="business-sharp"
              className="basicIcon smallIcon mr2"
            />
            <h2 className="textLeft">Business details</h2>
          </div>
          <p style={{ lineHeight: 2 }} className="m0 ml2">
            We use your business information to help auto fill
            invoices, quotes and contracts. If you want to know more
            about why we need this information and how we use it,
            please{" "}
            <a style={{ padding: 0 }} href="/help/privacy-policy" target="_blank" rel="noreferrer">
              view our privacy policy.
            </a>
          </p>
          <br />
          <form
            onSubmit={updateBusinessDetails}
            className="form-widget"
          >
            <div className="leftRow middle m0 ml2">
              <IonIcon
                name="person-circle-sharp"
                className="basicIcon smallIcon"
              />
              <h3 className="p2">How people find you</h3>
            </div>
            <label>Business Name *</label>
            <div className="m2 pr2">
              <input
                className="hundred"
                placeholder="business name"
                value={busName || ""}
                onChange={(e) =>
                  updateText(setBusName, e.target.value)
                }
                style={{
                  boxShadow: `${
                    errorText.field == "busName"
                      ? "0 0 10px 2px var(--dangerColor)"
                      : "0 0 0 0px var(--text)"
                  }`,
                }}
              />
            </div>
            <label>Business email *</label>

            <div className="m2 pr2">
              <input
                className="hundred"
                placeholder="email"
                value={email || ""}
                onChange={(e) => updateText(setEmail, e.target.value)}
                type="email"
                style={{
                  boxShadow: `${
                    errorText.field == "email"
                      ? "0 0 10px 2px var(--dangerColor)"
                      : "0 0 0 0px var(--text)"
                  }`,
                }}
              />
            </div>

            <label>Business phone</label>

            <div className="m2 pr2">
              <input
                className="hundred"
                placeholder="phone"
                value={phone || ""}
                onChange={(e) => updateText(setPhone, e.target.value)}
                type="number"
                style={{
                  boxShadow: `${
                    errorText.field == "phone"
                      ? "0 0 10px 2px var(--dangerColor)"
                      : "0 0 0 0px var(--text)"
                  }`,
                }}
              />
            </div>
            <label>ABN *</label>
            <div className="m2 pr2">
              <input
                className="hundred"
                placeholder="ABN"
                value={abn || ""}
                onChange={(e) => updateABN(e.target.value)}
                type="number"
                style={{
                  boxShadow: `${
                    errorText.field == "abn"
                      ? "0 0 10px 2px var(--dangerColor)"
                      : "0 0 0 0px var(--text)"
                  }`,
                }}
              />
            </div>
            <br />
            <div className="leftRow middle m0 ml2">
              <IonIcon
                name="location-sharp"
                className="basicIcon smallIcon"
              />
              <h3 className="p2">Location</h3>
            </div>
            <div className="leftRow dynamicRow" style={{ margin: 0 }}>
              <div className="hundred">
                <label>Street number *</label>
                <div className="m2 pr2">
                  <input
                    placeholder="street number"
                    value={streetNumber || ""}
                    onChange={(e) =>
                      updateText(setStreetNumber, e.target.value)
                    }
                    style={{
                      boxShadow: `${
                        errorText.field == "streetNumber"
                          ? "0 0 10px 2px var(--dangerColor)"
                          : "0 0 0 0px var(--text)"
                      }`,
                    }}
                  />
                </div>
              </div>
              <div className="hundred">
                <label>Street name *</label>
                <div className="m2 pr2">
                  <input
                    className="hundred"
                    placeholder="street name"
                    value={street || ""}
                    onChange={(e) =>
                      updateText(setStreet, e.target.value)
                    }
                    style={{
                      boxShadow: `${
                        errorText.field == "street"
                          ? "0 0 10px 2px var(--dangerColor)"
                          : "0 0 0 0px var(--text)"
                      }`,
                    }}
                  />
                </div>
              </div>
              <div className="hundred">
                <label>Suburb *</label>
                <div className="m2 pr2">
                  <input
                    className="hundred"
                    placeholder="suburb"
                    value={suburb || ""}
                    onChange={(e) =>
                      updateText(setSuburb, e.target.value)
                    }
                    style={{
                      boxShadow: `${
                        errorText.field == "suburb"
                          ? "0 0 10px 2px var(--dangerColor)"
                          : "0 0 0 0px var(--text)"
                      }`,
                    }}
                  />
                </div>
              </div>
            </div>

            <label>State *</label>
            <div className="m2 pr2">
              <input
                className="hundred"
                placeholder="state"
                value={state || ""}
                onChange={(e) => updateText(setState, e.target.value)}
                style={{
                  boxShadow: `${
                    errorText.field == "state"
                      ? "0 0 10px 2px var(--dangerColor)"
                      : "0 0 0 0px var(--text)"
                  }`,
                }}
              />
            </div>

            <label>Postcode *</label>

            <div className="m2 pr2">
              <input
                className="hundred"
                placeholder="postcode"
                value={postcode || ""}
                onChange={(e) => updatePostcode(e.target.value)}
                type="number"
                style={{
                  boxShadow: `${
                    errorText.field == "postcode"
                      ? "0 0 10px 2px var(--dangerColor)"
                      : "0 0 0 0px var(--text)"
                  }`,
                }}
              />
            </div>

            <br />

            <div className="leftRow middle m0 ml2">
              <IonIcon
                name="card-sharp"
                className="basicIcon smallIcon"
              />
              <h3 className="p2">Bank Details</h3>
            </div>
            <div className="hundred pr2">
              <label>Account name</label>
              <div className="m2 pr2">
                <input
                  className="hundred"
                  placeholder="account name"
                  value={accountName || ""}
                  onChange={(e) => updateAccName(e.target.value)}
                  type="text"
                  style={{
                    boxShadow: `${
                      errorText.field == "accountName"
                        ? "0 0 10px 2px var(--dangerColor)"
                        : "0 0 0 0px var(--text)"
                    }`,
                  }}
                />
              </div>
            </div>
            <div className="row m0 p0 hundred">
              <div className="hundred pr2">
                <label>BSB *</label>
                <div className="m2">
                  <input
                    className="hundred"
                    placeholder="BSB"
                    value={bsb || ""}
                    onChange={(e) => updateBSB(e.target.value)}
                    type="number"
                    style={{
                      boxShadow: `${
                        errorText.field == "bsb"
                          ? "0 0 10px 2px var(--dangerColor)"
                          : "0 0 0 0px var(--text)"
                      }`,
                    }}
                  />
                </div>
              </div>
              <div className="hundred pr2">
                <label>Account number *</label>
                <div className="m2">
                  <input
                    className="hundred"
                    placeholder="account number"
                    value={accountNum || ""}
                    onChange={(e) => updateAcc(e.target.value)}
                    type="number"
                    style={{
                      boxShadow: `${
                        errorText.field == "accountNum"
                          ? "0 0 10px 2px var(--dangerColor)"
                          : "0 0 0 0px var(--text)"
                      }`,
                    }}
                  />
                </div>
              </div>
            </div>

            <label>pay ID</label>
            <div className="m2 pr2">
              <input
                className="hundred"
                placeholder="pay ID"
                value={payId || ""}
                onChange={(e) => updateText(setPayId, e.target.value)}
                type="number"
                style={{
                  boxShadow: `${
                    errorText.field == "payId"
                      ? "0 0 10px 2px var(--dangerColor)"
                      : "0 0 0 0px var(--text)"
                  }`,
                }}
              />
            </div>
            <div className="hundred">
              <div className="pr2">
                <button
                  className="hundred accentButton centerRow"
                  type="submit"
                  disabled={saving}
                >
                  <IonIcon
                    name="save"
                    className="basicIcon smallIcon mr2"
                  />
                  {busLoading ? "Loading ..." : "Save"}
                </button>
              </div>
            </div>
            <h3 className="m2">Logo</h3>

            <div className="m2 pr2">
              <div className="leftRow m0">
                <input
                  type="file"
                  onChange={(v) => {
                    v?.target?.files &&
                      addFile(v.target.files[0], false);
                  }}
                  accept="image/*"
                />
                {croppedImage && (
                  <button
                    onClick={() => setConfirmLogoDeleteVisible(true)}
                  >
                    <IonIcon name="trash" style={{ width: 20 }} />
                  </button>
                )}
              </div>
              <div
                className="mediumFade"
                style={{
                  padding: "5px",
                  borderRadius: "5px",
                  margin: 0,
                  minHeight: 300,
                  width: "100%",
                }}
              >
                {downloadLogoUrl ? (
                  logoLoading ? (
                    <div
                      className="middle center"
                      style={{ minHeight: 300, width: 300 }}
                    >
                      <spinners.HashLoader
                        className="mediumFade center"
                        color="var(--primaryColor)"
                      />
                    </div>
                  ) : croppedImage ? (
                    <div
                      style={{
                        width: "300px",
                        height: "300px",
                        backgroundColor: "var(--text)",
                        margin: "10px",
                        borderRadius: "5px",
                      }}
                    >
                      <img
                        className="basicImage"
                        src={croppedImage}
                        style={{
                          maxWidth: "300px",
                          maxHeight: "300px",
                          borderRadius: "5px",
                        }}
                        alt={`logo for ${busName} on FreeFlex`}
                      />
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{
                          position: "relative",
                          width: "350px",
                          height: "300px",
                        }}
                      >
                        <Cropper
                          image={downloadLogoUrl}
                          crop={crop}
                          onCropChange={setCrop}
                          zoom={zoom}
                          onZoomChange={setZoom}
                          onCropComplete={onCropComplete}
                          aspect={1 / 1}
                        />
                      </div>
                      <button onClick={createCroppedImage}>
                        Submit
                      </button>
                    </div>
                  )
                ) : (
                  <div
                    style={{
                      width: "300px",
                      height: "300px",
                      backgroundColor: "var(--text)",
                      margin: "10px",
                      borderRadius: "5px",
                    }}
                  />
                )}
              </div>
            </div>
            <ErrorLabel
              active={errorText?.value}
              text={errorText?.value || ""}
              color={
                errorText?.value == "success!"
                  ? "var(--text)"
                  : "var(--dangerColor)"
              }
            />
          </form>
        </div>
      )}
    </div>
  );
}
