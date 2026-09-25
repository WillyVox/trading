# 2026/09/24

    Vercel link
     Development: https://tradingonline-git-development-willy-vox.vercel.app

     Prod: https://tradingonline.vercel.app/
     https://tradingonline-git-main-willy-vox.vercel.app
     https://tradingonline-ib1hdefih-willy-vox.vercel.app

# 2026/09/16

    ## make these three boxes to be clickable, navigate them to
        provider review page
        exchange compare page
        and guides page
        code clean, SEO perfectly config
        return me file updated/added while you implementing
        and return zip at the end

# Supabase set up

    # Project name: trading-guide
    # Database password: @Lac84890123
    # Region Asia-Pacific
    Link: https://supabase.com/dashboard/project/zjxycmdiymdfwacpvwsj

    * Get DB Connections (Project > Connect > ORM > Prisma)
        ```bash
            # Connect to Postgres via the shared transaction-mode pooler (IPv4-only)
            DATABASE_URL="postgresql://postgres.zjxycmdiymdfwacpvwsj:@Lac84890123@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
            # Connect to Postgres via the shared session-mode pooler (used for migrations)
            DIRECT_URL="postgresql://postgres.zjxycmdiymdfwacpvwsj:@Lac84890123@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
       ```
    * `[Password]` = Your password

    Then:
    1. in .evn paste   DATABASE_URL and DIRECT_URL
    2. schema.prisma, update
        datasource db {
            provider  = "postgresql"
            url       = env("DATABASE_URL")
            directUrl = env("DIRECT_URL")
        }
    3.
    npx prisma generate
    npx prisma migrate dev
    4. For production
        npx prisma migrate deploy

    # Alrernative of Supabase
        Neon is also excellent
        Neon is especially good if you want:
        pure serverless Postgres;
        branching databases;
        very easy Vercel integration;
        fast setup.
        Typical env:
        DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"

# Test image

    Link: https://picsum.photos/200/300

# Author profile

Huy Vo
Software engineer and Trading Guide editor

Research interests:
Australian trading platforms
broker technology
crypto exchange infrastructure

Articles are fact-checked using provider documentation,
ASIC/AUSTRAC records and official fee schedules.

# Methodology build

19. "Who it may suit" requires care

Finder and Canstar can do sophisticated user segmentation because they have extensive scoring methodologies.

We should not immediately write:

Best for beginner investors

unless we can explain why.

Instead initially use language like:

Potential strengths for beginners

and support it with factual criteria:

low minimum deposit
AUD deposits
simple interface
educational material
transparent fees

Then later, if you build a formal scoring methodology, you can legitimately produce categories like:

Best for beginners
Best for low-cost trading
Best for advanced traders
Best for AUD deposits

Finder's methodology is explicit about different user profiles and weighting.
