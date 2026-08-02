export async function onRequestPost(context) {
    try {
        const formData = await context.request.formData();
        const file = formData.get("file");
        if (!file) return Response.json({ success: false }, { status: 400 });

        const ext = file.name.substring(file.name.lastIndexOf('.')) || ".jpg";
        const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`;
        const buffer = await file.arrayBuffer();

        if (context.env.POS_BUCKET) {
            await context.env.POS_BUCKET.put(filename, buffer, { httpMetadata: { contentType: file.type } });
        }
        
        return Response.json({ success: true, url: `https://assets.kaelcafe.com/${filename}` });
    } catch (e) {
        return Response.json({ success: false, error: e.message }, { status: 500 });
    }
}
