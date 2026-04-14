CREATE TABLE IF NOT EXISTS user_address (
    address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_account ON DELETE CASCADE,
    country TEXT NOT NULL,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    street TEXT NOT NULL,
    zipcode TEXT NOT NULL 
);

CREATE TABLE IF NOT EXISTS user_account (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_role TEXT NOT NULL,

    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,

    first_name TEXT NOT NULL,
    middle_name TEXT NULL, 
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    phone_number TEXT NULL,

    profile_bio TEXT NULL,
    profile_picture TEXT NULL,
    profile_header TEXT NULL,

    date_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Regex Constraints
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT phone_format CHECK (phone_number ~* '^\+?[0-9]{10,15}$')
    CONSTRAINT user_role_constraint CHECK (user_role IN ('admin', 'supplier', 'provider'))
);

CREATE TABLE IF NOT EXISTS user_message (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    from_user_id UUID NOT NULL REFERENCES user_account ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES user_account ON DELETE CASCADE,

    message_content TEXT NOT NULL,
    message_status TEXT NOT NULL,

    date_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT cannot_message_self CHECK (from_user_id != to_user_id)
);

CREATE TABLE IF NOT EXISTS user_following (
    from_user_id UUID NOT NULL REFERENCES user_account ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES user_account ON DELETE CASCADE,
    date_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT cannot_follow_self CHECK (from_user_id != to_user_id)
);

CREATE TABLE IF NOT EXISTS user_post (
    post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_account ON DELETE CASCADE,
    post_title TEXT NOT NULL,
    post_content TEXT NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);