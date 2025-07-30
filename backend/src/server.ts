import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Local url: http://localhost:${PORT}`);
});
