import "./App.css";

// this is demo app for setting up the facebook ads conversion tracking
// we can get _fbc from the cookie as well (if we have installed the facebook/meta pixel on the website)
// we'll extract the facebook click id (fbclid) from the url and send store it as a cookie along with the facebook pixel id (fbp)
// then on Purchase (register in our case) we'll send the conversion data to backend with the facebook click id and facebook pixel id
// Example URL with ClickID: https://example.com/?fbclid=IwAR2F4-dbP0l7Mn1IawQQGCINEz7PYXQvwjNwB_qa2ofrHyiLjcbCRxTDGrc
function App() {
  // get the facebook click id (fbclid) and facebook pixel id (fbp) from the url
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get("fbclid");
  // const fbp = urlParams.get("fbp");

  // fbp will be available in the cookie if we have installed the facebook pixel on the website
  const fbp = document.cookie
    .split("; ")
    .find((row) => row.startsWith("_fbc"))
    .split("=")[1];

  // format the fbclid and fbp to store in the cookie

  // _fbc = version.subdomainIndex.creationTime.<fbclid>
  const _fbc = `fb.2.${Date.now()}.${fbclid}`;

  // fbp = version.subdomainIndex.creationTime.randomnumber // we can generate fbp on server (just need to keep subdomainIndex 1)
  const _fbp = `fb.1.${Date.now()}.${Math.floor(
    Math.random() * 10000000000000
  )}`;

  // create a form to send the conversion data to the backend
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      phone: formData.get("phone"),
      fbclid: fbclid,
      fbp: fbp
    };
    console.log(data);
    // send the data to the backend
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            style={{ marginBottom: "10px" }}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            required
            style={{ marginBottom: "10px" }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px"
            }}
          >
            Register
          </button>
        </form>
      </header>
    </div>
  );
}

export default App;
