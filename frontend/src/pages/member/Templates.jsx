import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Templates() {
  const [templates, setTemplates] = useState([]);

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  async function load() {
    try {
      const res =
        await api.get(
          "/templates"
        );

      setTemplates(
        res.data.data || []
      );
    } catch {}
  }

  async function create() {
    try {
      await api.post(
        "/templates",
        {
          title,
          message,
        }
      );

      setTitle("");
      setMessage("");

      load();

    } catch {
      alert("gagal");
    }
  }

  async function remove(id) {
    try {
      await api.delete(
        `/templates/${id}`
      );

      load();

    } catch {}
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginBottom: 30,
        }}
      >

        <div>

          <h1
            style={{
              color:
                "white",
            }}
          >
            Templates
          </h1>

          <p
            style={{
              color:
                "#64748b",
            }}
          >
            Kelola template
          </p>

        </div>

      </div>

      <div
        style={{
          background:
            "white",

          padding: 30,

          borderRadius:
            20,

          marginBottom:
            30,
        }}
      >

        <input
          placeholder="Judul"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
          style={{
            width:
              "100%",
            padding:
              14,
            marginBottom:
              12,
          }}
        />

        <textarea
          placeholder="Pesan"

          rows={5}

          value={message}

          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }

          style={{
            width:
              "100%",

            padding:
              14,
          }}
        />

        <button
          onClick={
            create
          }
          style={{
            marginTop:
              20,

            background:
              "#16a34a",

            color:
              "white",

            border:
              0,

            padding:
              "12px 20px",

            borderRadius:
              10,
          }}
        >
          Simpan
        </button>

      </div>

      <div
        style={{
          display:
            "grid",

          gap: 20,
        }}
      >

        {templates.map(
          (
            t
          ) => (
            <div
              key={
                t.id
              }
              style={{
                background:
                  "white",

                padding:
                  24,

                borderRadius:
                  18,
              }}
            >

              <h3>
                {
                  t.title
                }
              </h3>

              <p>
                {
                  t.message
                }
              </p>

              <button
                onClick={() =>
                  remove(
                    t.id
                  )
                }
                style={{
                  background:
                    "#ef4444",

                  color:
                    "white",

                  border:
                    0,

                  padding:
                    10,

                  borderRadius:
                    10,
                }}
              >
                Hapus
              </button>

            </div>
          )
        )}

      </div>

    </div>
  );
}