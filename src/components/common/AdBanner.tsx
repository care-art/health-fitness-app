import React, { useEffect } from 'react';

interface AdBannerProps {
  slot: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Google AdSense 广告横幅组件
 * 
 * 使用方法：
 * <AdBanner slot="广告位ID" />
 */
export const AdBanner: React.FC<AdBannerProps> = ({ 
  slot, 
  style = {}, 
  className = '' 
}) => {
  useEffect(() => {
    // 尝试加载广告
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{
        display: 'block',
        ...style
      }}
      data-ad-client="ca-pub-2914045399273515"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

/**
 * 文章内嵌广告
 */
export const AdInArticle: React.FC<{ slot: string }> = ({ slot }) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', textAlign: 'center' }}
      data-ad-layout="in-article"
      data-ad-format="fluid"
      data-ad-client="ca-pub-2914045399273515"
      data-ad-slot={slot}
    />
  );
};

/**
 * 侧边栏广告
 */
export const AdSidebar: React.FC<{ slot: string }> = ({ slot }) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="bg-gray-50 rounded-xl p-4 my-4">
      <p className="text-xs text-gray-400 text-center mb-2">广告</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2914045399273515"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
