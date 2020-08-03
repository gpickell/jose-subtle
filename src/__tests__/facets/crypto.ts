describe("crypto - shim", function () {
    test("JWK - generate - EC", async function () {
        const key = await jose.JWK.generate("EC", "P-256");
        expect(key).toBeDefined();
        console.log(key);

        const rkey = await page.evaluate(async function () {
            const key = await jose.JWK.generate("EC", "P-256");
            key.kid
            return key.toJWK(true);
        });

        expect(rkey).toBeDefined();

        console.log(rkey);
    });
});


export default undefined;
