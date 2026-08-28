import { useEffect, useState } from 'react';
import type { Profile } from '../types';

const defaultProfile: Profile = {
  nickname: 'MekaPilot',
  tier: '플래티넘 2',
  position: '돌격',
  heroes: ['D.Va', '아나'],
  nexon: false,
  providerStatus: 'none',
};

export function useAuthGate() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [onboarding, setOnboarding] = useState(false);
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  useEffect(() => {
    const savedAuth = localStorage.getItem('mme-auth') === 'true';
    const savedProfile = localStorage.getItem('mme-profile');
    if (savedProfile) setProfile((current) => ({ ...current, ...JSON.parse(savedProfile) }));
    setAuthenticated(savedAuth);
    setAuthReady(true);
  }, []);

  useEffect(() => {
    if (!authReady) return;
    localStorage.setItem('mme-profile', JSON.stringify(profile));
  }, [authReady, profile]);

  function completeLogin(provider: string) {
    setProfile((current) => ({ ...current, nexon: provider === '넥슨' || current.nexon }));
    setOnboarding(true);
  }

  function startApp() {
    setAuthenticated(true);
    setOnboarding(false);
    localStorage.setItem('mme-auth', 'true');
  }

  function logout() {
    localStorage.setItem('mme-auth', 'false');
    setAuthenticated(false);
  }

  return { authenticated, authReady, onboarding, profile, setProfile, completeLogin, startApp, logout };
}