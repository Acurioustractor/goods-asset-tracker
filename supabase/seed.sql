-- Goods Asset Register - Seed Data
-- Generated from: expanded_assets_final.csv
-- Total assets: 389

-- ============================================================================
-- SEED DATA: assets table
-- ============================================================================

-- Disable triggers temporarily for faster import
SET session_replication_role = 'replica';

BEGIN;

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-1',
    'GB0-1',
    'Red Dust',
    'Basket Bed',
    'Darwin',
    'Darwin, NT 0800, Australia',
    NULL,
    'Wayne',
    NULL,
    NULL,
    1,
    NULL,
    '2024-10-28T00:00:00',
    '2024-10-28T00:00:00',
    '2024-10-04T14:49:00',
    'https://goods-tracker.app/support?asset_id=GB0-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-2',
    'GB0-2',
    'Gloria - Double - Tent ',
    'Basket Bed',
    'Kalgoorlie',
    'Kalgoorlie, WA 6430, Australia',
    NULL,
    'Gloria / Church of Christ / Bega',
    'Green',
    ARRAY['Goods%20Asset%20Register/Screenshot_2024-10-04_at_12.58.25_PM.png']::TEXT[],
    1,
    NULL,
    '2024-10-04T00:00:00',
    '2024-10-04T00:00:00',
    '2024-10-04T14:49:00',
    'https://goods-tracker.app/support?asset_id=GB0-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-4',
    'GB0-4',
    'Boulder Double ',
    'Basket Bed',
    'Kalgoorlie',
    'Kalgoorlie, WA 6430, Australia',
    NULL,
    'Boulder Camp? / Church of Christ / Bega',
    'Yellow',
    ARRAY['Goods%20Asset%20Register/Screenshot_2024-10-04_at_1.03.14_PM.png']::TEXT[],
    1,
    NULL,
    '2024-10-04T00:00:00',
    '2024-10-04T00:00:00',
    '2024-10-04T14:49:00',
    'https://goods-tracker.app/support?asset_id=GB0-4'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-5',
    'GB0-5',
    'Jesse - Double  ',
    'Basket Bed',
    'Kalgoorlie',
    'Kalgoorlie, WA 6430, Australia',
    NULL,
    'Gloria / Church of Christ / Bega',
    'Green',
    ARRAY['Goods%20Asset%20Register/Screenshot_2024-10-04_at_1.04.06_PM.png']::TEXT[],
    1,
    NULL,
    '2024-10-04T00:00:00',
    '2024-10-04T00:00:00',
    '2024-10-04T14:49:00',
    'https://goods-tracker.app/support?asset_id=GB0-5'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-6',
    'GB0-6',
    'Ninga Mia - Single Test',
    'Basket Bed',
    'Kalgoorlie',
    'Kalgoorlie, WA 6430, Australia',
    NULL,
    'Gloria / Church of Christ / Bega',
    'Green',
    ARRAY['Goods%20Asset%20Register/Screenshot_2024-10-04_at_1.05.08_PM.png', 'Goods%20Asset%20Register/Screenshot_2024-10-04_at_1.04.58_PM.png']::TEXT[],
    1,
    NULL,
    '2024-10-04T00:00:00',
    '2024-10-04T00:00:00',
    '2024-10-04T15:04:00',
    'https://goods-tracker.app/support?asset_id=GB0-6'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-7',
    'GB0-7',
    'Single x Double - Jocelyn ',
    'Basket Bed',
    'Kalgoorlie',
    'Kalgoorlie, WA 6430, Australia',
    NULL,
    'Jocelyn /  Church of Christ ',
    'Pink',
    ARRAY['Goods%20Asset%20Register/Screenshot_2024-10-04_at_1.07.07_PM.png']::TEXT[],
    1,
    NULL,
    '2024-10-04T00:00:00',
    '2024-10-04T00:00:00',
    '2024-10-04T15:06:00',
    'https://goods-tracker.app/support?asset_id=GB0-7'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-8',
    'GB0-8',
    'Double - Eagles ',
    'Basket Bed',
    'Kalgoorlie',
    'Kalgoorlie, WA 6430, Australia',
    NULL,
    'Jocelyn /  Church of Christ ',
    'Pink',
    ARRAY['Goods%20Asset%20Register/Screenshot_2024-10-04_at_1.10.11_PM.png']::TEXT[],
    1,
    NULL,
    '2024-10-04T00:00:00',
    '2024-10-04T00:00:00',
    '2024-10-04T15:09:00',
    'https://goods-tracker.app/support?asset_id=GB0-8'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-9',
    'GB0-9',
    'Greate Bed - ',
    'Basket Bed',
    'Kalgoorlie',
    'Kalgoorlie, WA 6430, Australia',
    NULL,
    'Jocelyn - Ninga mia',
    'White',
    ARRAY['Goods%20Asset%20Register/Screenshot_2024-10-04_at_1.14.04_PM.png']::TEXT[],
    1,
    NULL,
    '2024-10-04T00:00:00',
    '2024-10-04T00:00:00',
    '2024-10-04T15:11:00',
    'https://goods-tracker.app/support?asset_id=GB0-9'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-10',
    'GB0-10',
    '12x Test Ninga mia',
    'Basket Bed',
    'Kalgoorlie',
    'Kalgoorlie, WA 6430, Australia',
    NULL,
    'First house at the front ',
    'Yellow',
    ARRAY['Goods%20Asset%20Register/Screenshot_2024-10-04_at_1.12.29_PM.png']::TEXT[],
    1,
    NULL,
    '2024-10-04T00:00:00',
    '2024-10-04T00:00:00',
    '2024-10-04T15:14:00',
    'https://goods-tracker.app/support?asset_id=GB0-10'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-11',
    'GB0-11',
    'Church of Christ Demo (( Beryls Bed))',
    'Basket Bed',
    'Kalgoorlie',
    'Kalgoorlie, WA 6430, Australia',
    NULL,
    'Tracey / Mel / Church of Christ ',
    'White',
    ARRAY['Goods%20Asset%20Register/Screenshot_2024-10-04_at_1.17.23_PM.png']::TEXT[],
    1,
    NULL,
    '2024-10-04T00:00:00',
    '2024-10-04T00:00:00',
    '2024-10-04T15:15:00',
    'https://goods-tracker.app/support?asset_id=GB0-11'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-12',
    'GB0-12',
    'Bega Demo ',
    'Basket Bed',
    'Kalgoorlie',
    'Kalgoorlie, WA 6430, Australia',
    NULL,
    'Deana / Anna ',
    NULL,
    ARRAY['Goods%20Asset%20Register/Screenshot_2024-10-04_at_1.12.45_PM.png']::TEXT[],
    1,
    NULL,
    '2024-10-04T00:00:00',
    '2024-10-04T00:00:00',
    '2024-10-04T15:17:00',
    'https://goods-tracker.app/support?asset_id=GB0-12'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-13',
    'GB0-13',
    'Normans Bed // Wilya Janta Demo Bed ',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    'Simon / Norman ',
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_3547.heic']::TEXT[],
    1,
    NULL,
    '2024-10-04T00:00:00',
    '2024-10-30T00:00:00',
    '2024-10-30T13:55:00',
    'https://goods-tracker.app/support?asset_id=GB0-13'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-14',
    'GB0-14',
    'Angelas - PICC ',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2024-11-04T00:00:00',
    '2024-11-04T00:00:00',
    '2024-11-04T19:22:00',
    'https://goods-tracker.app/support?asset_id=GB0-14'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-15',
    'GB0-15',
    'Thomas / Albert Bed ',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    'Cyntia ',
    NULL,
    NULL,
    1,
    NULL,
    '2024-11-11T00:00:00',
    '2024-11-11T00:00:00',
    '2024-11-04T19:23:00',
    'https://goods-tracker.app/support?asset_id=GB0-15'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-16',
    'GB0-16',
    'Jason’s Bed ',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2024-11-11T00:00:00',
    '2024-12-14T00:00:00',
    '2024-11-04T19:23:00',
    'https://goods-tracker.app/support?asset_id=GB0-16'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-17',
    'GB0-17',
    'William Ranger',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2024-11-11T00:00:00',
    '2024-11-11T00:00:00',
    '2024-11-05T15:43:00',
    'https://goods-tracker.app/support?asset_id=GB0-17'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-18',
    'GB0-18',
    'William Ranger double - left kit ',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2024-11-11T00:00:00',
    '2024-11-11T00:00:00',
    '2024-11-05T15:43:00',
    'https://goods-tracker.app/support?asset_id=GB0-18'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-19',
    'GB0-19',
    'Cyscilia bed - double stacked - under house ',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2024-11-11T00:00:00',
    '2024-11-11T00:00:00',
    '2024-11-05T15:43:00',
    'https://goods-tracker.app/support?asset_id=GB0-19'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-20',
    'GB0-20',
    'Shop owner double double ',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2024-11-11T00:00:00',
    '2024-11-11T00:00:00',
    '2024-11-05T15:44:00',
    'https://goods-tracker.app/support?asset_id=GB0-20'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-21',
    'GB0-21',
    'Janine Sibley ',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2024-11-11T00:00:00',
    '2024-11-11T00:00:00',
    '2024-11-05T15:45:00',
    'https://goods-tracker.app/support?asset_id=GB0-21'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-22-1',
    'GB0-22',
    'GB 22-32 - Churches of Christ x 10 kits ',
    'Basket Bed',
    'Kalgoorlie',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    10,
    NULL,
    '2024-11-28T00:00:00',
    '2024-11-28T00:00:00',
    '2024-11-17T21:13:00',
    'https://goods-tracker.app/support?asset_id=GB0-22-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-22-2',
    'GB0-22',
    'GB 22-32 - Churches of Christ x 10 kits ',
    'Basket Bed',
    'Kalgoorlie',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    10,
    NULL,
    '2024-11-28T00:00:00',
    '2024-11-28T00:00:00',
    '2024-11-17T21:13:00',
    'https://goods-tracker.app/support?asset_id=GB0-22-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-22-3',
    'GB0-22',
    'GB 22-32 - Churches of Christ x 10 kits ',
    'Basket Bed',
    'Kalgoorlie',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    10,
    NULL,
    '2024-11-28T00:00:00',
    '2024-11-28T00:00:00',
    '2024-11-17T21:13:00',
    'https://goods-tracker.app/support?asset_id=GB0-22-3'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-22-4',
    'GB0-22',
    'GB 22-32 - Churches of Christ x 10 kits ',
    'Basket Bed',
    'Kalgoorlie',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    10,
    NULL,
    '2024-11-28T00:00:00',
    '2024-11-28T00:00:00',
    '2024-11-17T21:13:00',
    'https://goods-tracker.app/support?asset_id=GB0-22-4'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-22-5',
    'GB0-22',
    'GB 22-32 - Churches of Christ x 10 kits ',
    'Basket Bed',
    'Kalgoorlie',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    10,
    NULL,
    '2024-11-28T00:00:00',
    '2024-11-28T00:00:00',
    '2024-11-17T21:13:00',
    'https://goods-tracker.app/support?asset_id=GB0-22-5'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-22-6',
    'GB0-22',
    'GB 22-32 - Churches of Christ x 10 kits ',
    'Basket Bed',
    'Kalgoorlie',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    10,
    NULL,
    '2024-11-28T00:00:00',
    '2024-11-28T00:00:00',
    '2024-11-17T21:13:00',
    'https://goods-tracker.app/support?asset_id=GB0-22-6'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-22-7',
    'GB0-22',
    'GB 22-32 - Churches of Christ x 10 kits ',
    'Basket Bed',
    'Kalgoorlie',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    10,
    NULL,
    '2024-11-28T00:00:00',
    '2024-11-28T00:00:00',
    '2024-11-17T21:13:00',
    'https://goods-tracker.app/support?asset_id=GB0-22-7'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-22-8',
    'GB0-22',
    'GB 22-32 - Churches of Christ x 10 kits ',
    'Basket Bed',
    'Kalgoorlie',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    10,
    NULL,
    '2024-11-28T00:00:00',
    '2024-11-28T00:00:00',
    '2024-11-17T21:13:00',
    'https://goods-tracker.app/support?asset_id=GB0-22-8'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-22-9',
    'GB0-22',
    'GB 22-32 - Churches of Christ x 10 kits ',
    'Basket Bed',
    'Kalgoorlie',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    10,
    NULL,
    '2024-11-28T00:00:00',
    '2024-11-28T00:00:00',
    '2024-11-17T21:13:00',
    'https://goods-tracker.app/support?asset_id=GB0-22-9'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-22-10',
    'GB0-22',
    'GB 22-32 - Churches of Christ x 10 kits ',
    'Basket Bed',
    'Kalgoorlie',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    10,
    NULL,
    '2024-11-28T00:00:00',
    '2024-11-28T00:00:00',
    '2024-11-17T21:13:00',
    'https://goods-tracker.app/support?asset_id=GB0-22-10'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-23-1',
    'GB0-23',
    'Alan Palm Island',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    'Alan 0482 555 308',
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9033.jpeg']::TEXT[],
    3,
    NULL,
    '2024-12-13T00:00:00',
    '2024-12-13T00:00:00',
    '2024-12-13T11:59:00',
    'https://goods-tracker.app/support?asset_id=GB0-23-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-23-2',
    'GB0-23',
    'Alan Palm Island',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    'Alan 0482 555 308',
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9033.jpeg']::TEXT[],
    3,
    NULL,
    '2024-12-13T00:00:00',
    '2024-12-13T00:00:00',
    '2024-12-13T11:59:00',
    'https://goods-tracker.app/support?asset_id=GB0-23-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-23-3',
    'GB0-23',
    'Alan Palm Island',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    'Alan 0482 555 308',
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9033.jpeg']::TEXT[],
    3,
    NULL,
    '2024-12-13T00:00:00',
    '2024-12-13T00:00:00',
    '2024-12-13T11:59:00',
    'https://goods-tracker.app/support?asset_id=GB0-23-3'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-27-1',
    'GB0-27',
    'Steven',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    'Steven',
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9035.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-13T00:00:00',
    '2025-05-22T00:00:00',
    '2024-12-13T12:27:00',
    'https://goods-tracker.app/support?asset_id=GB0-27-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-27-2',
    'GB0-27',
    'Steven',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    'Steven',
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9035.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-13T00:00:00',
    '2025-05-22T00:00:00',
    '2024-12-13T12:27:00',
    'https://goods-tracker.app/support?asset_id=GB0-27-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-28',
    'GB0-28',
    'Eva - Council',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    '0448 465 440',
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9036.jpeg']::TEXT[],
    1,
    NULL,
    '2024-12-13T00:00:00',
    '2024-12-13T00:00:00',
    '2024-12-13T12:36:00',
    'https://goods-tracker.app/support?asset_id=GB0-28'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-29',
    'GB0-29',
    'Double double base // Natalie ',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2024-12-13T00:00:00',
    '2024-12-13T00:00:00',
    '2024-12-13T16:08:00',
    'https://goods-tracker.app/support?asset_id=GB0-29'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-30-1',
    'GB0-30',
    'Albert',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9042.jpeg']::TEXT[],
    3,
    NULL,
    '2024-12-13T00:00:00',
    '2025-05-22T00:00:00',
    '2024-12-13T16:30:00',
    'https://goods-tracker.app/support?asset_id=GB0-30-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-30-2',
    'GB0-30',
    'Albert',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9042.jpeg']::TEXT[],
    3,
    NULL,
    '2024-12-13T00:00:00',
    '2025-05-22T00:00:00',
    '2024-12-13T16:30:00',
    'https://goods-tracker.app/support?asset_id=GB0-30-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-30-3',
    'GB0-30',
    'Albert',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9042.jpeg']::TEXT[],
    3,
    NULL,
    '2024-12-13T00:00:00',
    '2025-05-22T00:00:00',
    '2024-12-13T16:30:00',
    'https://goods-tracker.app/support?asset_id=GB0-30-3'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-33',
    'GB0-33',
    'Terayar',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9043.jpeg']::TEXT[],
    1,
    NULL,
    '2024-12-13T00:00:00',
    '2024-12-13T00:00:00',
    '2024-12-13T16:49:00',
    'https://goods-tracker.app/support?asset_id=GB0-33'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-35-1',
    'GB0-35',
    'Jessica Fraser - double ',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9044.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-13T00:00:00',
    '2024-12-13T00:00:00',
    '2024-12-13T16:52:00',
    'https://goods-tracker.app/support?asset_id=GB0-35-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-35-2',
    'GB0-35',
    'Jessica Fraser - double ',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9044.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-13T00:00:00',
    '2024-12-13T00:00:00',
    '2024-12-13T16:52:00',
    'https://goods-tracker.app/support?asset_id=GB0-35-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-36-1',
    'GB0-36',
    'Ursula - queen ',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9045.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-13T00:00:00',
    '2025-02-17T00:00:00',
    '2024-12-13T17:34:00',
    'https://goods-tracker.app/support?asset_id=GB0-36-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-36-2',
    'GB0-36',
    'Ursula - queen ',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9045.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-13T00:00:00',
    '2025-02-17T00:00:00',
    '2024-12-13T17:34:00',
    'https://goods-tracker.app/support?asset_id=GB0-36-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-39-1',
    'GB0-39',
    'Gavin',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9057.jpeg']::TEXT[],
    2,
    'Good still using it - took it out camping and then was taken by the flodd water - washed it once',
    '2024-12-14T00:00:00',
    '2024-12-14T00:00:00',
    '2024-12-14T10:31:00',
    'https://goods-tracker.app/support?asset_id=GB0-39-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-39-2',
    'GB0-39',
    'Gavin',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9057.jpeg']::TEXT[],
    2,
    'Good still using it - took it out camping and then was taken by the flodd water - washed it once',
    '2024-12-14T00:00:00',
    '2024-12-14T00:00:00',
    '2024-12-14T10:31:00',
    'https://goods-tracker.app/support?asset_id=GB0-39-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-42-1',
    'GB0-42',
    'Derren',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9058.jpeg']::TEXT[],
    2,
    'Good - was worried about the kids getting hurt if they jumped on it and it broke',
    '2024-12-14T00:00:00',
    '2025-05-22T00:00:00',
    '2024-12-14T10:50:00',
    'https://goods-tracker.app/support?asset_id=GB0-42-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-42-2',
    'GB0-42',
    'Derren',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9058.jpeg']::TEXT[],
    2,
    'Good - was worried about the kids getting hurt if they jumped on it and it broke',
    '2024-12-14T00:00:00',
    '2025-05-22T00:00:00',
    '2024-12-14T10:50:00',
    'https://goods-tracker.app/support?asset_id=GB0-42-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-43-1',
    'GB0-43',
    'Tarayar',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9059.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T11:34:00',
    '2024-12-14T11:34:00',
    'https://goods-tracker.app/support?asset_id=GB0-43-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-43-2',
    'GB0-43',
    'Tarayar',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9059.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T11:34:00',
    '2024-12-14T11:34:00',
    'https://goods-tracker.app/support?asset_id=GB0-43-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-47-1',
    'GB0-47',
    'Kevin',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9060.jpeg']::TEXT[],
    3,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T00:00:00',
    '2024-12-14T11:59:00',
    'https://goods-tracker.app/support?asset_id=GB0-47-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-47-2',
    'GB0-47',
    'Kevin',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9060.jpeg']::TEXT[],
    3,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T00:00:00',
    '2024-12-14T11:59:00',
    'https://goods-tracker.app/support?asset_id=GB0-47-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-47-3',
    'GB0-47',
    'Kevin',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9060.jpeg']::TEXT[],
    3,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T00:00:00',
    '2024-12-14T11:59:00',
    'https://goods-tracker.app/support?asset_id=GB0-47-3'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-50-1',
    'GB0-50',
    'Ivy - double',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    'Ivy',
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9061.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-14T00:00:00',
    '2025-05-22T12:29:00',
    '2024-12-14T12:30:00',
    'https://goods-tracker.app/support?asset_id=GB0-50-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-50-2',
    'GB0-50',
    'Ivy - double',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    'Ivy',
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9061.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-14T00:00:00',
    '2025-05-22T12:29:00',
    '2024-12-14T12:30:00',
    'https://goods-tracker.app/support?asset_id=GB0-50-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-52-1',
    'GB0-52',
    'Rob / Alan',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9067.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T12:55:00',
    '2024-12-14T13:13:00',
    'https://goods-tracker.app/support?asset_id=GB0-52-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-52-2',
    'GB0-52',
    'Rob / Alan',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9067.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T12:55:00',
    '2024-12-14T13:13:00',
    'https://goods-tracker.app/support?asset_id=GB0-52-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-54-1',
    'GB0-54',
    'Benjamin',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9068.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T13:19:00',
    '2024-12-14T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-54-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-54-2',
    'GB0-54',
    'Benjamin',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9068.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T13:19:00',
    '2024-12-14T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-54-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-56-1',
    'GB0-56',
    'Benjamin - queen',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9068.jpeg']::TEXT[],
    2,
    NULL,
    '2025-05-22T00:00:00',
    '2025-05-22T13:19:00',
    '2024-12-14T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-56-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-56-2',
    'GB0-56',
    'Benjamin - queen',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9068.jpeg']::TEXT[],
    2,
    NULL,
    '2025-05-22T00:00:00',
    '2025-05-22T13:19:00',
    '2024-12-14T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-56-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-57-1',
    'GB0-57',
    'Avis',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9070.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-14T00:00:00',
    '2025-02-17T16:10:00',
    '2024-12-14T16:10:00',
    'https://goods-tracker.app/support?asset_id=GB0-57-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-57-2',
    'GB0-57',
    'Avis',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9070.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-14T00:00:00',
    '2025-02-17T16:10:00',
    '2024-12-14T16:10:00',
    'https://goods-tracker.app/support?asset_id=GB0-57-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-61-1',
    'GB0-61',
    'Colleen',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9071.jpeg']::TEXT[],
    3,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T16:14:00',
    '2024-12-14T16:15:00',
    'https://goods-tracker.app/support?asset_id=GB0-61-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-61-2',
    'GB0-61',
    'Colleen',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9071.jpeg']::TEXT[],
    3,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T16:14:00',
    '2024-12-14T16:15:00',
    'https://goods-tracker.app/support?asset_id=GB0-61-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-61-3',
    'GB0-61',
    'Colleen',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9071.jpeg']::TEXT[],
    3,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T16:14:00',
    '2024-12-14T16:15:00',
    'https://goods-tracker.app/support?asset_id=GB0-61-3'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-62-1',
    'GB0-62',
    'Cathy',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9072.jpeg']::TEXT[],
    4,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T16:48:00',
    '2024-12-14T16:48:00',
    'https://goods-tracker.app/support?asset_id=GB0-62-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-62-2',
    'GB0-62',
    'Cathy',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9072.jpeg']::TEXT[],
    4,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T16:48:00',
    '2024-12-14T16:48:00',
    'https://goods-tracker.app/support?asset_id=GB0-62-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-62-3',
    'GB0-62',
    'Cathy',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9072.jpeg']::TEXT[],
    4,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T16:48:00',
    '2024-12-14T16:48:00',
    'https://goods-tracker.app/support?asset_id=GB0-62-3'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-62-4',
    'GB0-62',
    'Cathy',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9072.jpeg']::TEXT[],
    4,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T16:48:00',
    '2024-12-14T16:48:00',
    'https://goods-tracker.app/support?asset_id=GB0-62-4'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-66',
    'GB0-66',
    'Eb - double',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9073.jpeg']::TEXT[],
    1,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T00:00:00',
    '2024-12-14T17:56:00',
    'https://goods-tracker.app/support?asset_id=GB0-66'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-68',
    'GB0-68',
    'Collette Double B',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9074.jpeg']::TEXT[],
    1,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T00:00:00',
    '2024-12-14T18:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-68'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-70-1',
    'GB0-70',
    'Collette',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9074.jpeg']::TEXT[],
    3,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T00:00:00',
    '2024-12-14T18:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-70-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-70-2',
    'GB0-70',
    'Collette',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9074.jpeg']::TEXT[],
    3,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T00:00:00',
    '2024-12-14T18:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-70-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-70-3',
    'GB0-70',
    'Collette',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9074.jpeg']::TEXT[],
    3,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T00:00:00',
    '2024-12-14T18:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-70-3'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-72-1',
    'GB0-72',
    'Camaleta B',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9074.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T00:00:00',
    '2024-12-14T18:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-72-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-72-2',
    'GB0-72',
    'Camaleta B',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9074.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-14T00:00:00',
    '2024-12-14T00:00:00',
    '2024-12-14T18:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-72-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-73',
    'GB0-73',
    'Collette',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9074.jpeg']::TEXT[],
    1,
    NULL,
    '2024-12-14T00:00:00',
    '2025-05-22T00:00:00',
    '2024-12-14T18:59:00',
    'https://goods-tracker.app/support?asset_id=GB0-73'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-83-1',
    'GB0-83',
    'Mark - queen ',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    'Mark',
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9083.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-15T00:00:00',
    '2024-12-15T13:29:00',
    '2024-12-15T13:29:00',
    'https://goods-tracker.app/support?asset_id=GB0-83-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-83-2',
    'GB0-83',
    'Mark - queen ',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    'Mark',
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9083.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-15T00:00:00',
    '2024-12-15T13:29:00',
    '2024-12-15T13:29:00',
    'https://goods-tracker.app/support?asset_id=GB0-83-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-86-1',
    'GB0-86',
    'John',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9086.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-15T00:00:00',
    '2024-12-15T14:46:00',
    '2024-12-15T14:47:00',
    'https://goods-tracker.app/support?asset_id=GB0-86-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-86-2',
    'GB0-86',
    'John',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_9086.jpeg']::TEXT[],
    2,
    NULL,
    '2024-12-15T00:00:00',
    '2024-12-15T14:46:00',
    '2024-12-15T14:47:00',
    'https://goods-tracker.app/support?asset_id=GB0-86-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-89',
    'GB0-89',
    'William Ranger',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2024-11-11T00:00:00',
    '2024-11-11T00:00:00',
    '2025-02-17T12:05:00',
    'https://goods-tracker.app/support?asset_id=GB0-89'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-91',
    'GB0-91',
    'Laura',
    'Basket Bed',
    NULL,
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2024-12-14T00:00:00',
    '2025-05-22T15:44:00',
    '2025-05-22T15:44:00',
    'https://goods-tracker.app/support?asset_id=GB0-91'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-92',
    'GB0-92',
    'Jodie Newcastle ',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2024-12-14T00:00:00',
    NULL,
    '2025-06-26T10:54:00',
    'https://goods-tracker.app/support?asset_id=GB0-92'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-93',
    'GB0-93',
    'Floyd James ',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    '048862853 ',
    NULL,
    NULL,
    1,
    NULL,
    '2024-12-14T00:00:00',
    NULL,
    '2025-06-26T14:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-93'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-94',
    'GB0-94',
    'Angeline Malaga camp ',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2024-12-14T00:00:00',
    NULL,
    '2025-06-26T14:53:00',
    'https://goods-tracker.app/support?asset_id=GB0-94'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-95',
    'GB0-95',
    'Tyreake - 1 double double ',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2024-12-14T00:00:00',
    NULL,
    '2025-06-26T16:32:00',
    'https://goods-tracker.app/support?asset_id=GB0-95'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-97',
    'GB0-97',
    'Cheredith Nemo and she lives on Staunton St',
    'Basket Bed',
    'Alice Springs',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2024-12-14T00:00:00',
    NULL,
    '2025-06-27T09:50:00',
    'https://goods-tracker.app/support?asset_id=GB0-97'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-104-1',
    'GB0-104',
    'Dianne - double',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    'Dianne Stokes',
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_3129.jpeg']::TEXT[],
    2,
    NULL,
    '2025-06-28T00:00:00',
    '2025-06-28T11:17:00',
    '2025-06-28T11:17:00',
    'https://goods-tracker.app/support?asset_id=GB0-104-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-104-2',
    'GB0-104',
    'Dianne - double',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    'Dianne Stokes',
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_3129.jpeg']::TEXT[],
    2,
    NULL,
    '2025-06-28T00:00:00',
    '2025-06-28T11:17:00',
    '2025-06-28T11:17:00',
    'https://goods-tracker.app/support?asset_id=GB0-104-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-105',
    'GB0-105',
    'Sylvia',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_3130%201.jpeg']::TEXT[],
    1,
    NULL,
    '2025-07-02T00:00:00',
    '2025-06-28T11:26:00',
    '2025-06-28T11:26:00',
    'https://goods-tracker.app/support?asset_id=GB0-105'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-106',
    'GB0-106',
    'Norm',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2025-07-02T00:00:00',
    '2025-06-28T13:32:00',
    '2025-06-28T13:32:00',
    'https://goods-tracker.app/support?asset_id=GB0-106'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-107',
    'GB0-107',
    'Norms daugter',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_3132.jpeg']::TEXT[],
    1,
    NULL,
    '2025-07-02T00:00:00',
    '2025-06-28T13:33:00',
    '2025-06-28T13:33:00',
    'https://goods-tracker.app/support?asset_id=GB0-107'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-108-1',
    'GB0-108',
    'Family',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_3109.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-29T09:32:00',
    'https://goods-tracker.app/support?asset_id=GB0-108-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-108-2',
    'GB0-108',
    'Family',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_3109.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-29T09:32:00',
    'https://goods-tracker.app/support?asset_id=GB0-108-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-109-1',
    'GB0-109',
    '??',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_3104.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-29T09:32:00',
    'https://goods-tracker.app/support?asset_id=GB0-109-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-109-2',
    'GB0-109',
    '??',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_3104.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-29T09:32:00',
    'https://goods-tracker.app/support?asset_id=GB0-109-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-110-1',
    'GB0-110',
    'Next to Dianne',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_3101.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-29T09:33:00',
    'https://goods-tracker.app/support?asset_id=GB0-110-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-110-2',
    'GB0-110',
    'Next to Dianne',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_3101.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-29T09:33:00',
    'https://goods-tracker.app/support?asset_id=GB0-110-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-111',
    'GB0-111',
    'Brian',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_3100.heic']::TEXT[],
    1,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-29T09:34:00',
    'https://goods-tracker.app/support?asset_id=GB0-111'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-112-1',
    'GB0-112',
    'Junior’s House',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_3099.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-29T09:34:00',
    'https://goods-tracker.app/support?asset_id=GB0-112-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-112-2',
    'GB0-112',
    'Junior’s House',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_3099.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-29T09:34:00',
    'https://goods-tracker.app/support?asset_id=GB0-112-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-113',
    'GB0-113',
    'Norman',
    'ID Washing Machine',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/20250702-IMG_8072.jpg']::TEXT[],
    1,
    NULL,
    '2025-07-02T00:00:00',
    '2025-07-02T00:00:00',
    '2025-06-29T10:24:00',
    'https://goods-tracker.app/support?asset_id=GB0-113'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-114',
    'GB0-114',
    'Dianne’s friend',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/IMG_3130.jpeg']::TEXT[],
    1,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-29T10:25:00',
    'https://goods-tracker.app/support?asset_id=GB0-114'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-115-1',
    'GB0-115',
    'Dianne’s daughter Anne maree',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%209.heic']::TEXT[],
    3,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-30T17:39:00',
    'https://goods-tracker.app/support?asset_id=GB0-115-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-115-2',
    'GB0-115',
    'Dianne’s daughter Anne maree',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%209.heic']::TEXT[],
    3,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-30T17:39:00',
    'https://goods-tracker.app/support?asset_id=GB0-115-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-115-3',
    'GB0-115',
    'Dianne’s daughter Anne maree',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%209.heic']::TEXT[],
    3,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-30T17:39:00',
    'https://goods-tracker.app/support?asset_id=GB0-115-3'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-116-1',
    'GB0-116',
    'Dianne brother - stan',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%208.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-30T17:50:00',
    'https://goods-tracker.app/support?asset_id=GB0-116-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-116-2',
    'GB0-116',
    'Dianne brother - stan',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%208.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-30T17:50:00',
    'https://goods-tracker.app/support?asset_id=GB0-116-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-118-1',
    'GB0-118',
    'Dianne’s son',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%207.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-30T18:08:00',
    'https://goods-tracker.app/support?asset_id=GB0-118-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-118-2',
    'GB0-118',
    'Dianne’s son',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%207.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-30T18:08:00',
    'https://goods-tracker.app/support?asset_id=GB0-118-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-119-1',
    'GB0-119',
    'Nelly Peterson',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%206.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-30T18:24:00',
    'https://goods-tracker.app/support?asset_id=GB0-119-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-119-2',
    'GB0-119',
    'Nelly Peterson',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%206.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-06-30T18:24:00',
    'https://goods-tracker.app/support?asset_id=GB0-119-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-120-1',
    'GB0-120',
    'Kerry - Juniors Aunty',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%205.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-07-01T11:04:00',
    'https://goods-tracker.app/support?asset_id=GB0-120-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-120-2',
    'GB0-120',
    'Kerry - Juniors Aunty',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%205.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-07-01T11:04:00',
    'https://goods-tracker.app/support?asset_id=GB0-120-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-121-1',
    'GB0-121',
    'Next to Juniors Aunty',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%204.heic']::TEXT[],
    3,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-07-01T11:55:00',
    'https://goods-tracker.app/support?asset_id=GB0-121-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-121-2',
    'GB0-121',
    'Next to Juniors Aunty',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%204.heic']::TEXT[],
    3,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-07-01T11:55:00',
    'https://goods-tracker.app/support?asset_id=GB0-121-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-121-3',
    'GB0-121',
    'Next to Juniors Aunty',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%204.heic']::TEXT[],
    3,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-07-01T11:55:00',
    'https://goods-tracker.app/support?asset_id=GB0-121-3'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-122',
    'GB0-122',
    'Dylan',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%203.heic']::TEXT[],
    1,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-07-01T16:09:00',
    'https://goods-tracker.app/support?asset_id=GB0-122'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-123',
    'GB0-123',
    'Sheradith',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%202.heic']::TEXT[],
    1,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-07-01T17:04:00',
    'https://goods-tracker.app/support?asset_id=GB0-123'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-124-1',
    'GB0-124',
    'KW',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%201.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-07-01T17:12:00',
    'https://goods-tracker.app/support?asset_id=GB0-124-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-124-2',
    'GB0-124',
    'KW',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%201.heic']::TEXT[],
    2,
    NULL,
    '2025-07-02T00:00:00',
    NULL,
    '2025-07-01T17:12:00',
    'https://goods-tracker.app/support?asset_id=GB0-124-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-125',
    'GB0-125',
    'Barkley Arts',
    'ID Washing Machine',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo.heic']::TEXT[],
    1,
    NULL,
    '2025-07-02T00:00:00',
    '2025-07-02T00:00:00',
    '2025-07-01T19:09:00',
    'https://goods-tracker.app/support?asset_id=GB0-125'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-129',
    'GB0-129',
    'Dianne - weave bed',
    'Weave Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2025-06-28T00:00:00',
    NULL,
    '2025-07-06T14:15:00',
    'https://goods-tracker.app/support?asset_id=GB0-129'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-130',
    'GB0-130',
    'Jimmy - weave bed',
    'Weave Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2025-06-28T00:00:00',
    NULL,
    '2025-07-06T14:15:00',
    'https://goods-tracker.app/support?asset_id=GB0-130'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-131',
    'GB0-131',
    'Junior Weave Bed',
    'Weave Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2025-06-28T00:00:00',
    NULL,
    '2025-07-06T14:16:00',
    'https://goods-tracker.app/support?asset_id=GB0-131'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-132',
    'GB0-132',
    'Jimmy - Washer',
    'ID Washing Machine',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/20250702-IMG_8034.jpg']::TEXT[],
    1,
    NULL,
    '2025-07-02T00:00:00',
    '2025-07-02T00:00:00',
    '2025-07-06T14:17:00',
    'https://goods-tracker.app/support?asset_id=GB0-132'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-133',
    'GB0-133',
    'Jimmy’s Uncle - Washer',
    'ID Washing Machine',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/20250702-IMG_8057.jpg']::TEXT[],
    1,
    NULL,
    '2025-07-02T00:00:00',
    '2025-07-02T00:00:00',
    '2025-07-06T14:17:00',
    'https://goods-tracker.app/support?asset_id=GB0-133'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-134',
    'GB0-134',
    'Cythia',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%2010.heic']::TEXT[],
    1,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-08-09T17:28:00',
    'https://goods-tracker.app/support?asset_id=GB0-134'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-135',
    'GB0-135',
    'Rangers Station',
    'ID Washing Machine',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2025-07-09T00:00:00',
    '2025-08-12T00:00:00',
    '2025-09-24T09:41:00',
    'https://goods-tracker.app/support?asset_id=GB0-135'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-136-1',
    'GB0-136',
    'Oochiumpa',
    'ID Washing Machine',
    'Palm Island',
    'Alice Springs, NT 0870, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    3,
    NULL,
    '2025-08-12T00:00:00',
    '2025-08-12T00:00:00',
    '2025-09-24T09:41:00',
    'https://goods-tracker.app/support?asset_id=GB0-136-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-136-2',
    'GB0-136',
    'Oochiumpa',
    'ID Washing Machine',
    'Palm Island',
    'Alice Springs, NT 0870, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    3,
    NULL,
    '2025-08-12T00:00:00',
    '2025-08-12T00:00:00',
    '2025-09-24T09:41:00',
    'https://goods-tracker.app/support?asset_id=GB0-136-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-136-3',
    'GB0-136',
    'Oochiumpa',
    'ID Washing Machine',
    'Palm Island',
    'Alice Springs, NT 0870, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    3,
    NULL,
    '2025-08-12T00:00:00',
    '2025-08-12T00:00:00',
    '2025-09-24T09:41:00',
    'https://goods-tracker.app/support?asset_id=GB0-136-3'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-137',
    'GB0-137',
    'Workers House',
    'ID Washing Machine',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2025-08-12T00:00:00',
    '2025-08-12T00:00:00',
    '2025-09-24T09:43:00',
    'https://goods-tracker.app/support?asset_id=GB0-137'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-138',
    'GB0-138',
    'Luella Bligh',
    'ID Washing Machine',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2025-08-12T00:00:00',
    '2025-08-12T00:00:00',
    '2025-09-24T09:43:00',
    'https://goods-tracker.app/support?asset_id=GB0-138'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-139',
    'GB0-139',
    'Ebs Aunty',
    'ID Washing Machine',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2025-08-12T00:00:00',
    '2025-08-12T00:00:00',
    '2025-09-24T09:44:00',
    'https://goods-tracker.app/support?asset_id=GB0-139'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-140',
    'GB0-140',
    'Mark',
    'Basket Bed',
    'Mount Isa',
    'Mount Isa, QLD 4825, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2025-07-09T00:00:00',
    NULL,
    '2025-09-24T09:47:00',
    'https://goods-tracker.app/support?asset_id=GB0-140'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-141',
    'GB0-141',
    'Riverbed Action Group',
    'Basket Bed',
    'Mount Isa',
    'Mount Isa, QLD 4825, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    NULL,
    '2025-07-16T00:00:00',
    NULL,
    '2025-09-24T09:47:00',
    'https://goods-tracker.app/support?asset_id=GB0-141'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-142-1',
    'GB0-142',
    'Weave Bad',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    9,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-142-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-142-2',
    'GB0-142',
    'Weave Bad',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    9,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-142-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-142-3',
    'GB0-142',
    'Weave Bad',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    9,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-142-3'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-142-4',
    'GB0-142',
    'Weave Bad',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    9,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-142-4'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-142-5',
    'GB0-142',
    'Weave Bad',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    9,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-142-5'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-142-6',
    'GB0-142',
    'Weave Bad',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    9,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-142-6'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-142-7',
    'GB0-142',
    'Weave Bad',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    9,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-142-7'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-142-8',
    'GB0-142',
    'Weave Bad',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    9,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-142-8'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-142-9',
    'GB0-142',
    'Weave Bad',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    9,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-142-9'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-143-1',
    'GB0-143',
    'Additional Washers',
    'ID Washing Machine',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    2,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-143-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-143-2',
    'GB0-143',
    'Additional Washers',
    'ID Washing Machine',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    2,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-143-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-1',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-2',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-3',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-3'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-4',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-4'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-5',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-5'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-6',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-6'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-7',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-7'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-8',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-8'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-9',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-9'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-10',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-10'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-11',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-11'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-12',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-12'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-13',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-13'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-14',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-14'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-15',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-15'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-16',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-16'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-17',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-17'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-18',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-18'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-19',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-19'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-20',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-20'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-21',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-21'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-22',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-22'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-23',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-23'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-24',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-24'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-25',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-25'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-26',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-26'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-27',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-27'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-28',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-28'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-29',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-29'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-30',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-30'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-31',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-31'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-32',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-32'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-33',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-33'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-34',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-34'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-35',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-35'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-36',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-36'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-37',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-37'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-38',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-38'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-39',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-39'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-40',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-40'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-41',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-41'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-42',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-42'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-43',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-43'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-44',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-44'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-45',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-45'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-46',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-46'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-47',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-47'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-48',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-48'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-49',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-49'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-50',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-50'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-51',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-51'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-52',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-52'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-53',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-53'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-54',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-54'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-55',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-55'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-56',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-56'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-57',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-57'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-58',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-58'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-59',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-59'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-60',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-60'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-61',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-61'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-62',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-62'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-63',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-63'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-64',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-64'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-65',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-65'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-66',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-66'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-67',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-67'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-68',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-68'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-69',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-69'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-70',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-70'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-71',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-71'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-72',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-72'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-73',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-73'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-74',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-74'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-75',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-75'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-76',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-76'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-77',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-77'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-78',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-78'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-79',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-79'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-80',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-80'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-81',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-81'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-82',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-82'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-83',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-83'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-84',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-84'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-85',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-85'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-86',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-86'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-87',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-87'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-88',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-88'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-89',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-89'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-144-90',
    'GB0-144',
    'Additional Beds Tennant',
    'Basket Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    90,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-144-90'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-1',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-2',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-3',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-3'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-4',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-4'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-5',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-5'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-6',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-6'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-7',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-7'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-8',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-8'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-9',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-9'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-10',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-10'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-11',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-11'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-12',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-12'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-13',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-13'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-14',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-14'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-15',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-15'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-16',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-16'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-17',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-17'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-18',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-18'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-19',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-19'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-20',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-20'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-21',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-21'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-22',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-22'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-23',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-23'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-24',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-24'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-25',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-25'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-26',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-26'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-27',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-27'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-28',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-28'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-29',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-29'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-30',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-30'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-31',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-31'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-32',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-32'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-33',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-33'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-34',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-34'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-35',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-35'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-36',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-36'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-37',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-37'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-38',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-38'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-39',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-39'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-40',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-40'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-41',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-41'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-42',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-42'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-43',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-43'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-44',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-44'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-45',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-45'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-46',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-46'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-47',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-47'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-48',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-48'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-49',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-49'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-50',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-50'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-51',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-51'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-52',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-52'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-53',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-53'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-54',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-54'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-55',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-55'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-56',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-56'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-57',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-57'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-58',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-58'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-59',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-59'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-145-60',
    'GB0-145',
    'Additional Beds Palm',
    'Basket Bed',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-08-05T00:00:00',
    NULL,
    '2025-09-24T09:51:00',
    'https://goods-tracker.app/support?asset_id=GB0-145-60'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-147',
    'GB0-147',
    'Club Kuta machine',
    'ID Washing Machine',
    'Palm Island',
    'Palm Island, QLD 4816, Australia',
    NULL,
    'Mislam',
    NULL,
    ARRAY['Goods%20Asset%20Register/photo%2011.heic']::TEXT[],
    1,
    NULL,
    '2025-09-28T00:00:00',
    '2025-09-28T00:00:00',
    '2025-09-28T10:16:00',
    'https://goods-tracker.app/support?asset_id=GB0-147'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-1',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-2',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-3',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-3'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-4',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-4'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-5',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-5'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-6',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-6'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-7',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-7'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-8',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-8'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-9',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-9'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-10',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-10'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-11',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-11'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-12',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-12'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-13',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-13'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-14',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-14'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-15',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-15'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-16',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-16'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-17',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-17'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-18',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-18'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-19',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-19'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-20',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-20'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-21',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-21'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-22',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-22'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-23',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-23'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-24',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-24'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-25',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-25'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-26',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-26'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-27',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-27'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-28',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-28'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-29',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-29'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-30',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-30'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-31',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-31'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-32',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-32'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-33',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-33'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-34',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-34'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-35',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-35'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-36',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-36'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-37',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-37'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-38',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-38'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-39',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-39'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-40',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-40'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-41',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-41'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-42',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-42'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-43',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-43'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-44',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-44'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-45',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-45'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-46',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-46'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-47',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-47'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-48',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-48'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-49',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-49'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-50',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-50'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-51',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-51'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-52',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-52'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-53',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-53'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-54',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-54'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-55',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-55'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-56',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-56'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-57',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-57'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-58',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-58'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-59',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-59'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-148-60',
    'GB0-148',
    'Utopia Homelands',
    'Basket Bed',
    'Alice Homelands',
    'Utopia Urapuntja Health Centre',
    NULL,
    NULL,
    NULL,
    NULL,
    60,
    NULL,
    '2025-10-08T00:00:00',
    '2025-10-27T00:00:00',
    '2025-10-27T13:18:00',
    'https://goods-tracker.app/support?asset_id=GB0-148-60'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-1',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-2',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-3',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-3'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-4',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-4'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-5',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-5'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-6',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-6'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-7',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-7'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-8',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-8'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-9',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-9'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-10',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-10'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-11',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-11'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-12',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-12'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-13',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-13'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-14',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-14'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-15',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-15'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-16',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-16'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-17',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-17'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-149-18',
    'GB0-149',
    'Maningrida',
    'Basket Bed',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    18,
    NULL,
    '2025-10-14T00:00:00',
    NULL,
    '2025-10-27T13:20:00',
    'https://goods-tracker.app/support?asset_id=GB0-149-18'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-150-1',
    'GB0-150',
    'Maningrida Laundry',
    'ID Washing Machine',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    6,
    NULL,
    '2025-10-20T00:00:00',
    '2025-10-14T00:00:00',
    '2025-10-27T13:25:00',
    'https://goods-tracker.app/support?asset_id=GB0-150-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-150-2',
    'GB0-150',
    'Maningrida Laundry',
    'ID Washing Machine',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    6,
    NULL,
    '2025-10-20T00:00:00',
    '2025-10-14T00:00:00',
    '2025-10-27T13:25:00',
    'https://goods-tracker.app/support?asset_id=GB0-150-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-150-3',
    'GB0-150',
    'Maningrida Laundry',
    'ID Washing Machine',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    6,
    NULL,
    '2025-10-20T00:00:00',
    '2025-10-14T00:00:00',
    '2025-10-27T13:25:00',
    'https://goods-tracker.app/support?asset_id=GB0-150-3'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-150-4',
    'GB0-150',
    'Maningrida Laundry',
    'ID Washing Machine',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    6,
    NULL,
    '2025-10-20T00:00:00',
    '2025-10-14T00:00:00',
    '2025-10-27T13:25:00',
    'https://goods-tracker.app/support?asset_id=GB0-150-4'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-150-5',
    'GB0-150',
    'Maningrida Laundry',
    'ID Washing Machine',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    6,
    NULL,
    '2025-10-20T00:00:00',
    '2025-10-14T00:00:00',
    '2025-10-27T13:25:00',
    'https://goods-tracker.app/support?asset_id=GB0-150-5'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-150-6',
    'GB0-150',
    'Maningrida Laundry',
    'ID Washing Machine',
    'Maningrida',
    'Maningrida, NT 0822, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    6,
    NULL,
    '2025-10-20T00:00:00',
    '2025-10-14T00:00:00',
    '2025-10-27T13:25:00',
    'https://goods-tracker.app/support?asset_id=GB0-150-6'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-151-1',
    'GB0-151',
    'Tennant Weave Beds',
    'Weave Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    3,
    NULL,
    '2025-10-07T00:00:00',
    NULL,
    '2025-10-27T13:35:00',
    'https://goods-tracker.app/support?asset_id=GB0-151-1'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-151-2',
    'GB0-151',
    'Tennant Weave Beds',
    'Weave Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    3,
    NULL,
    '2025-10-07T00:00:00',
    NULL,
    '2025-10-27T13:35:00',
    'https://goods-tracker.app/support?asset_id=GB0-151-2'
);

INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    'GB0-151-3',
    'GB0-151',
    'Tennant Weave Beds',
    'Weave Bed',
    'Tennet Creek',
    'Tennant Creek, NT 0860, Australia',
    NULL,
    NULL,
    NULL,
    NULL,
    3,
    NULL,
    '2025-10-07T00:00:00',
    NULL,
    '2025-10-27T13:35:00',
    'https://goods-tracker.app/support?asset_id=GB0-151-3'
);

COMMIT;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check total count
SELECT 'Total assets: ' || COUNT(*) FROM assets;

-- Check product breakdown
SELECT product, COUNT(*) as count FROM assets GROUP BY product ORDER BY count DESC;

-- Check community breakdown
SELECT community, COUNT(*) as count FROM assets GROUP BY community ORDER BY count DESC;

-- Sample records
SELECT unique_id, name, product, community FROM assets LIMIT 10;

-- Check for duplicates
SELECT unique_id, COUNT(*) FROM assets GROUP BY unique_id HAVING COUNT(*) > 1;

