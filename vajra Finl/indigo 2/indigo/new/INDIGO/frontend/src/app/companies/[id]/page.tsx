import CompanyDetailsView from '@/components/CompanyDetailsView';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  const staticIds = Array.from({ length: 500 }, (_, i) => ({ id: String(i + 1) }));
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://vajraxsentina.onrender.com';
    const res = await fetch(`${API_URL}/api/companies/?active_only=true`).catch(() => null);
    if (res && res.ok) {
      const companies = await res.json();
      if (Array.isArray(companies)) {
        const apiIds = companies.map((c: any) => ({ id: String(c.id) }));
        return [...staticIds, ...apiIds];
      }
    }
  } catch {
    // fallback
  }
  return staticIds;
}

export default function CompanyDetailPage() {
  return <CompanyDetailsView />;
}
