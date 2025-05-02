(async () => {
    const { default: app } = await import('./index.js');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})().catch(err => {
    console.error('Failed to load app:', err);
});