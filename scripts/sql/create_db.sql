-- This will create the database from scratch.

DROP DATABASE IF EXISTS agricodb;
CREATE DATABASE agricodb;
\c agricodb

-- Useful Enums
CREATE TYPE MESSAGE_STATUS_ENUM AS ENUM ('read', 'sent');
CREATE TYPE LISTING_TYPE_ENUM AS ENUM ('product', 'service');
CREATE TYPE LISTING_STATUS_ENUM AS ENUM ('private', 'public');
CREATE TYPE IMPRESSION_TYPE AS ENUM ('like', 'dislike', 'favorite', 'view');
CREATE TYPE ORDER_STATUS_TYPE AS ENUM ('delivered', 'pending');

-- 1. Categories for our products/services.
-- For dependency reasons, this is created first.
CREATE TABLE IF NOT EXISTS listing_category (
    listing_category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name TEXT NOT NULL,
    category_type LISTING_TYPE_ENUM NOT NULL
);

-- 2. User Accounts
CREATE TABLE IF NOT EXISTS user_account (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT NULL, -- Nullable (not everyone has one)
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    phone_number TEXT,
    profile_bio TEXT NULL,
    profile_picture TEXT NULL,
    profile_header TEXT NULL,
    country TEXT NOT NULL,
    address TEXT,
    date_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Regex Constraints
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT phone_format CHECK (phone_number ~* '^\+?[0-9]{10,15}$')
);

-- 3. Listings
-- Which is basically the "products" or "services".
CREATE TABLE IF NOT EXISTS listing (
    listing_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_account ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES listing_category,
    listing_type LISTING_TYPE_ENUM NOT NULL,
    listing_title TEXT NOT NULL,
    listing_details TEXT,
    listing_price NUMERIC(19, 4) NOT NULL CHECK (listing_price >= 0),
    listing_quantity INTEGER NOT NULL DEFAULT 1 CHECK (listing_quantity >= 0),
    listing_status LISTING_STATUS_ENUM NOT NULL DEFAULT 'public',
    date_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Messages
CREATE TABLE IF NOT EXISTS user_message (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id UUID NOT NULL REFERENCES user_account ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES user_account ON DELETE CASCADE,
    message_content TEXT NOT NULL,
    message_status MESSAGE_STATUS_ENUM NOT NULL DEFAULT 'sent',
    date_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cannot_message_self CHECK (from_user_id != to_user_id)
);

-- 5. Personal posts. Seperate from the listings, which is much cleaner, I guess.
CREATE TABLE IF NOT EXISTS post (
    post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_account ON DELETE CASCADE,
    post_title TEXT NOT NULL,
    post_content TEXT NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Comments, which could be under a listing, a post, or a comment. 
-- Only one of those. The constraints express that.
CREATE TABLE IF NOT EXISTS comment (
    comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_account ON DELETE CASCADE,
    parent_listing_id UUID REFERENCES listing ON DELETE CASCADE,
    parent_post_id UUID REFERENCES post ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comment ON DELETE CASCADE,
    content TEXT NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Polymorphic target constraint
    CONSTRAINT comment_target_check CHECK (
        (parent_listing_id IS NOT NULL)::integer + 
        (parent_post_id IS NOT NULL)::integer + 
        (parent_comment_id IS NOT NULL)::integer = 1
    ),
    CONSTRAINT no_self_reference CHECK (comment_id != parent_comment_id)
);

-- 7. User Engagement
-- Just like comments, it can be for a post, a listing, or a comment. Only one.
CREATE TABLE IF NOT EXISTS impression (
    impression_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_account(user_id) ON DELETE CASCADE,
    post_id UUID REFERENCES post(post_id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listing(listing_id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comment(comment_id) ON DELETE CASCADE,
    impression_type IMPRESSION_TYPE NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT impression_target_check CHECK (
        (post_id IS NOT NULL)::integer + 
        (listing_id IS NOT NULL)::integer + 
        (comment_id IS NOT NULL)::integer = 1
    )
);

-- 7. Media Handling (that is, images and videos).
-- Media, for posts/listings. To reduce complexities, not available for messages/comments.
CREATE TABLE IF NOT EXISTS media (
    media_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listing(listing_id) ON DELETE CASCADE,
    post_id UUID REFERENCES post(post_id) ON DELETE CASCADE,
    media_path TEXT NOT NULL,
    
    CONSTRAINT media_target_check CHECK (
        (listing_id IS NOT NULL)::integer + (post_id IS NOT NULL)::integer = 1
    )
);

-- 8. Orders made by users
-- This basically acts as the "receipt". Doesn't have the actual items.
CREATE TABLE IF NOT EXISTS user_order (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_account(user_id) ON DELETE SET NULL,
    order_status ORDER_STATUS_TYPE NOT NULL DEFAULT 'pending',
    total_amount NUMERIC(19, 4) NOT NULL CHECK (total_amount >= 0),
    date_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. The actual items of the orders
-- This contains the contents of the "receipt".
CREATE TABLE IF NOT EXISTS order_item (
    order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES user_order(order_id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listing(listing_id) ON DELETE SET NULL,
    sale_price NUMERIC(19, 4) NOT NULL, -- Snapshot of price at time of sale
    order_quantity INTEGER NOT NULL DEFAULT 1 CHECK (order_quantity > 0)
);

-- Indexes, for performance reasons.
CREATE INDEX IF NOT EXISTS index_listing_user ON listing(user_id);
CREATE INDEX IF NOT EXISTS index_comment_listing ON comment(parent_listing_id) WHERE parent_listing_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS index_comment_post ON comment(parent_post_id) WHERE parent_post_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS index_order_user ON user_order(user_id);