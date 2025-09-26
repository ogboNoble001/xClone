fetch("https://xclone-vc7a.onrender.com/api/db-status")
                        .then(res => {
                                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                                return res.json();
                        })
                        .then(status => {
                                console.log(`🔹 Backend status: online`);
                                console.log(`🗄 MongoDB status: ${status.status}`);
                        })
                        .catch(err => console.error("❌ Fetch error:", err));
                