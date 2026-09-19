export const TIER_CONFIG = {
  free: {
    name: 'Free',
    addressLimit: 25,
    canResizeLabels: false,
  },
  hobby: {
    name: 'Hobby',
    addressLimit: 250,
    canResizeLabels: true,
  },
  unlimited: {
    name: 'Unlimited',
    addressLimit: Infinity,
    canResizeLabels: true,
  },
}

export function getTierConfig(tier) {
  return TIER_CONFIG[tier] || TIER_CONFIG.free
}

export function canUseFeature(tier, feature) {
  return Boolean(getTierConfig(tier)[feature])
}
