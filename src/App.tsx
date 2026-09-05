import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { RecordPage } from './pages/RecordPage';
import { MetaPage } from './pages/MetaPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { GroupPage } from './pages/GroupPage';
import { CommunityPage } from './pages/CommunityPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/record" replace />} />
        <Route path="record" element={<RecordPage />} />
        <Route path="record/meta" element={<MetaPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="group" element={<GroupPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/record" replace />} />
      </Route>
    </Routes>
  );
}