# hausDiscordBot
This is a multi purpose bot for a private discord server. 
You may use anything you find in here that's useful.

Because this bot is not meant for 1:1 copying, I will not provide a full README. I will provide a summary of what this bot contains.

There is infrastructure for chatting with openAI GPT using langchain and pinecone to create both short term and long term memories.

There is infrastructure for generating AI images using both Stable Diffusion and DALLE.

There is infrastructure for regularly checking RSS feeds of hackernews as well as several major mainstream media outlets, and posting them in discord.  

Futhermore, there is code for posting random items from a database on a cron schedule.

There are phrase generation functions (nsfw!).

There is a very convoluted bannedword.js file in which you can see my attempt to ban a phrase and reinvent the wheel on detecting leetspeak workarounds.

There are various examples of discord commands and mod tools, some of which are no longer necessary as Discord has built them in now.  Of interest might be the snipe tool to retrieve deleted messages, or the warning system to warn misbehaving users.