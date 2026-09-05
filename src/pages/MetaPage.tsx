import { useNavigate } from 'react-router-dom';
import { MetaView } from '../features/record/MetaView';
import { useApp } from '../app/outlet-context';

export function MetaPage() {
  const navigate = useNavigate();
  const { metaData } = useApp();

  return <MetaView data={metaData} onDiary={() => navigate('/record')} />;
}