const ban = () => {
    document.getElementById("ban-form").onsubmit = () => {
        fetch("/admin/ban", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: document.getElementById("username").value
            })
        }).then(resp => {
            if (!resp.ok) {
                document.getElementById("error").style.display = "flex";

                return;
            }

            //maybe add a confirmation animation later, not really what I'm good at
            $('#modal').modal('hide');
        });

        return false;
    }
}

document.addEventListener("DOMContentLoaded", ban);