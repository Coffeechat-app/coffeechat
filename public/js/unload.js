function defreshUnload(f) {
  if (f !== location.href) {
    if (f.replace(location.protocol + "//" + location.hostname, "") !== "/") {
      alert(
        "Loading " +
          f.replace(location.protocol + "//" + location.hostname, "") +
          "..."
      );
    } else {
      alert("Going Home...");
    }
  } else {
    alert("Loading...");
  }
}
