import { Platform, Dimensions } from 'react-native'

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

export const colors = {
  bg:          '#0A0A0A',
  bgCard:      '#111111',
  bgCardAlt:   '#161616',
  bgInput:     'rgba(255,255,255,0.05)',
  border:      'rgba(255,255,255,0.08)',
  borderGold:  'rgba(201,168,76,0.35)',
  gold:        '#C9A84C',
  goldLight:   '#E2C070',
  goldFaded:   'rgba(201,168,76,0.15)',
  white:       '#F5F3EE',
  grey:        '#888888',
  greyDark:    '#555555',
  greyLight:   '#AAAAAA',
  black:       '#060606',
  danger:      '#FF6B6B',
  success:     '#4CAF50',
  successFaded:'rgba(76,175,80,0.15)',
}

export const fonts = {
  serif:  Platform.select({ ios: 'Georgia', android: 'serif' }),
  sans:   Platform.select({ ios: 'System',  android: 'Roboto' }),
}

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
}

export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  full: 999,
}

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  gold: {
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
}
