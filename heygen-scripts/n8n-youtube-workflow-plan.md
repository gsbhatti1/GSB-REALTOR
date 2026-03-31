# GSB Realtor — Full YouTube Auto-Post Workflow

## Workflow: "GSB — Video to YouTube"

### Flow
1. **Webhook** (POST /video-to-youtube)
   - Receives: { title, description, script, tags[], videoUrl }
   
2. **HTTP Request** — Download video from HeyGen URL
   - GET {{ $json.body.videoUrl }}
   - Response: Binary file
   
3. **YouTube — Upload Video**
   - Credential: GSB Realtor YouTube
   - Title: {{ $json.body.title }}
   - Description: {{ $json.body.description }}
   - Tags: {{ $json.body.tags }}
   - Privacy: public
   - Category: People & Blogs (or Real Estate)
   - Video file: from previous node binary
   
4. **Gmail** — Send confirmation
   - To: gsbhatti1@yahoo.com
   - Subject: ✅ Video Posted to YouTube!
   - Body: "{{ $json.body.title }} is now live on YouTube! 
     View: https://youtube.com/channel/UCBy3qI2JI0aNWRozpuCevQA"

## Future: Combined Generate + Post Workflow
1. Webhook (listing data)
2. OpenAI — write script from listing details  
3. HeyGen — generate video with Gurpreet avatar
4. Wait/Poll — check video status every 2 min
5. Download video from HeyGen URL
6. YouTube — upload
7. Gmail — notify Gurpreet
