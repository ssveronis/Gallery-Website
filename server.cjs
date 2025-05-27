if(process.argv[2] === "setup" && process.argv[3].includes("@")){
    const db = new DB();
} else {
    (async () => {
    const { default: app } = await import('./index.js');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    })().catch(err => {
        console.error('Failed to load app:', err);
    });
}