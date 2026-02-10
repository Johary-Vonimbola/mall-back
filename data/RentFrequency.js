const FREQUENCY = {
    monthly: "monthly",
    bimonthly: "bimonthly",
    quarterly: "quarterly",
    halfYearly: "halfYearly",
    yearly: "yearly"
};

const FREQUENCY_ENUM = Object.values(FREQUENCY);

const FREQUENCY_MAP = {};
FREQUENCY_MAP[FREQUENCY.monthly] = 1;
FREQUENCY_MAP[FREQUENCY.bimonthly] = 2;
FREQUENCY_MAP[FREQUENCY.quarterly] = 3;
FREQUENCY_MAP[FREQUENCY.halfYearly] = 6;
FREQUENCY_MAP[FREQUENCY.halfYearly] = 12;

module.exports = {
    FREQUENCY, FREQUENCY_ENUM, FREQUENCY_MAP
};