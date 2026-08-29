import { useState } from 'react';
import { PageTitle } from '../../components/layout/PageTitle';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Tabs } from '../../components/ui/Tabs';
import type { MetaData, MetaScope, MetricKey } from '../../types';

const scopeLabels: Record<MetaScope, string> = {
  overall: '전체',
  rank: '등급별',
  role: '역할별',
  map: '전장별',
  region: '지역별',
};

const metricLabels: Record<MetricKey, string> = {
  pickRate: '픽률',
  winRate: '승률',
  banRate: '금지율',
};

export function MetaView({ data, onDiary }: { data: MetaData; onDiary: () => void }) {
  const [scope, setScope] = useState<MetaScope>('overall');
  const [selection, setSelection] = useState('');
  const [metric, setMetric] = useState<MetricKey>('pickRate');

  const groups =
    scope === 'rank' ? data.ranks : scope === 'role' ? data.roles : scope === 'map' ? data.maps : scope === 'region' ? data.regions : {};
  const options = Object.entries(groups);
  const activeKey = selection && groups[selection] ? selection : options[0]?.[0] || '';
  const activeLabel = scope === 'overall' ? '한국 · PC · 경쟁전 · 전체 등급' : groups[activeKey]?.label || '데이터 선택';
  const source = scope === 'overall' ? data.overall : groups[activeKey]?.heroes || [];
  const ranking = source.slice().sort((a, b) => (b[metric] || 0) - (a[metric] || 0));
  const top = ranking.slice(0, 3);

  return (
    <div className="max-w-[88vw] xl:max-w-[1240px] mx-auto py-12 px-4">
      <PageTitle
        eyebrow="LIVE META ARCHIVE"
        title="공식 데이터로"
        accent="메타를 읽으세요."
        description="픽률·승률·금지율을 등급, 역할, 전장과 지역별로 살펴보세요."
        action={
          <div className="flex gap-1.5 max-[760px]:w-full">
            <Button variant="outline" size="compact" onClick={onDiary} className="max-[760px]:flex-1">
              나의 기록
            </Button>
            <Button variant="primary" size="compact" className="max-[760px]:flex-1">
              메타 인사이트
            </Button>
          </div>
        }
      />

      <section className="flex gap-3 items-start p-4 mb-6 border border-white/10 bg-surface">
        <span className="w-6 h-6 grid place-items-center rounded-full border border-white/20 text-[10px]">i</span>
        <div className="flex-1">
          <b className="block text-sm">공식 공개 통계 스냅샷</b>
          <p className="text-muted text-xs mt-1">
            표본 수와 집계 기간은 공개되지 않았습니다. 그랜드마스터와 챔피언은 공식 원본처럼 합산됩니다.
          </p>
        </div>
        <small className="text-muted text-[10px] whitespace-nowrap">
          {data.fetchedAt ? new Date(data.fetchedAt).toLocaleString('ko-KR') : '데이터 불러오는 중'}
        </small>
      </section>

      <Tabs
        items={Object.keys(scopeLabels) as MetaScope[]}
        active={scope}
        onChange={(value) => {
          setScope(value);
          setSelection('');
        }}
        labelOf={(item) => scopeLabels[item]}
      />

      <section className="flex items-center justify-between gap-4 mt-4 mb-8 flex-wrap">
        <div>
          <label className="block text-muted text-[10px] font-extrabold tracking-widest mb-1">분석 범위</label>
          <strong>{activeLabel}</strong>
        </div>

        {scope !== 'overall' && (
          <label className="grid gap-2 text-muted text-[11px] font-extrabold">
            세부 조건
            <Select value={activeKey} onChange={(event) => setSelection(event.target.value)}>
              {options.map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </Select>
          </label>
        )}

        <Tabs
          items={Object.keys(metricLabels) as MetricKey[]}
          active={metric}
          onChange={setMetric}
          labelOf={(item) => metricLabels[item]}
        />
      </section>

      {ranking.length ? (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8 max-[760px]:grid-cols-1">
            {top.map((hero, index) => (
              <article key={hero.heroId} className="relative p-5 border border-white/10 bg-surface flex items-center gap-4">
                <span className="text-3xl font-black text-accent/40">0{index + 1}</span>
                <img src={hero.thumbnailUrl} alt="" className="w-12 h-12 object-cover" />
                <div>
                  <small className="text-muted text-[9px] tracking-widest">
                    {hero.role.toUpperCase()} · {hero.subrole}
                  </small>
                  <h2 className="font-black">{hero.name}</h2>
                  <b className="text-accent">{hero[metric].toFixed(1)}%</b>
                </div>
              </article>
            ))}
          </div>

          <section className="border border-white/10">
            <header className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <p className="text-accent text-[11px] font-extrabold tracking-[0.2em]">HERO RANKING</p>
                <h2 className="font-black">{metricLabels[metric]} 전체 순위</h2>
              </div>
              <span className="text-muted text-xs">{ranking.length} HEROES</span>
            </header>

            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] px-4 py-2 text-muted text-[10px] font-extrabold tracking-widest border-b border-white/10">
              <span>순위 / 영웅</span>
              <span>역할</span>
              <span>픽률</span>
              <span>승률</span>
              <span>금지율</span>
            </div>

            {ranking.map((hero, index) => (
              <article
                key={hero.heroId}
                className={`grid grid-cols-[auto_auto_1fr_auto_auto_auto] md:grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-3 px-4 py-3 border-b border-white/5 ${
                  index < 3 ? 'bg-accent/5' : ''
                }`}
              >
                <b className="text-muted">{String(index + 1).padStart(2, '0')}</b>
                <img src={hero.thumbnailUrl} alt="" className="w-9 h-9 object-cover" />
                <strong>{hero.name}</strong>
                <span className="text-muted text-xs">
                  {hero.role} · {hero.subrole}
                </span>
                <i className={`not-italic ${metric === 'pickRate' ? 'text-accent font-bold' : 'text-muted'}`}>
                  {hero.pickRate.toFixed(1)}%
                </i>
                <i className={`not-italic ${metric === 'winRate' ? 'text-accent font-bold' : 'text-muted'}`}>
                  {hero.winRate.toFixed(1)}%
                </i>
              </article>
            ))}
          </section>
        </>
      ) : (
        <section className="text-center py-20">
          <span className="text-4xl text-accent">◇</span>
          <h2 className="font-black mt-3">통계를 불러오고 있어요.</h2>
          <p className="text-muted text-sm mt-1">잠시 후 공식 스냅샷이 표시됩니다.</p>
        </section>
      )}
    </div>
  );
}