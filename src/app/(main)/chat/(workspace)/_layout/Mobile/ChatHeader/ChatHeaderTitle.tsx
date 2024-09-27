import { ActionIcon, MobileNavBarTitle } from '@lobehub/ui';
import { useTheme } from 'antd-style';
import { ChevronDown } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { useInboxAgentMeta } from '@/hooks/useInboxAgentMeta';
import { useChatStore } from '@/store/chat';
import { topicSelectors } from '@/store/chat/selectors';
import { useGlobalStore } from '@/store/global';

const ChatHeaderTitle = memo(() => {
  const { t } = useTranslation(['chat', 'custom']);
  const toggleConfig = useGlobalStore((s) => s.toggleMobileTopic);
  const [topicLength, topic] = useChatStore((s) => [
    topicSelectors.currentTopicLength(s),
    topicSelectors.currentActiveTopic(s),
  ]);

  const { title } = useInboxAgentMeta();

  const theme = useTheme();

  return (
    <MobileNavBarTitle
      desc={
        <Flexbox align={'center'} gap={4} horizontal onClick={() => toggleConfig()}>
          <span>{topic?.title || t('topic.title')}</span>
          <ActionIcon
            active
            icon={ChevronDown}
            size={{ blockSize: 14, borderRadius: '50%', fontSize: 12 }}
            style={{
              background: theme.colorFillSecondary,
              color: theme.colorTextDescription,
            }}
          />
        </Flexbox>
      }
      title={
        <div
          onClick={() => toggleConfig()}
          style={{
            marginRight: '8px',
            maxWidth: '64vw',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
          {topicLength > 1 ? `(${topicLength + 1})` : ''}
        </div>
      }
    />
  );
});

export default ChatHeaderTitle;
