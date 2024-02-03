import { Azure, OpenAI } from '@lobehub/icons';
import { Form, type ItemGroup, Markdown } from '@lobehub/ui';
import { Form as AntForm, AutoComplete, Divider, Input, Switch } from 'antd';
import { createStyles } from 'antd-style';
import { debounce } from 'lodash-es';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { FORM_STYLE } from '@/const/layoutTokens';
import { ModelProvider } from '@/libs/agent-runtime';
import { useGlobalStore } from '@/store/global';
import { modelProviderSelectors } from '@/store/global/selectors';

import Checker from '../Checker';
import { LLMProviderConfigKey } from '../const';
import { useSyncSettings } from '../useSyncSettings';

const useStyles = createStyles(({ css, token }) => ({
  markdown: css`
    a {
      font-size: 12px !important;
    }

    p {
      font-size: 12px !important;
      color: ${token.colorTextDescription} !important;
    }
  `,
  tip: css`
    font-size: 12px;
    color: ${token.colorTextDescription};
  `,
}));

const providerKey = 'azureOpenAI';

const AzureOpenAIProvider = memo(() => {
  const { t } = useTranslation('setting');
  const [form] = AntForm.useForm();
  const { styles } = useStyles();

  const [toggleProviderEnabled, setSettings] = useGlobalStore((s) => [
    s.toggleProviderEnabled,
    s.setSettings,
  ]);

  const enabled = useGlobalStore(modelProviderSelectors.enableAzure);

  useSyncSettings(form);

  const openAI: ItemGroup = {
    children: [
      {
        children: (
          <Input.Password
            autoComplete={'new-password'}
            placeholder={t('llm.AzureOpenAI.token.placeholder')}
          />
        ),
        desc: t('llm.AzureOpenAI.token.desc'),
        label: t('llm.AzureOpenAI.token.title'),
        name: [LLMProviderConfigKey, providerKey, 'apikey'],
      },
      {
        children: <Input allowClear placeholder={t('llm.AzureOpenAI.endpoint.placeholder')} />,
        desc: t('llm.AzureOpenAI.endpoint.desc'),
        label: t('llm.AzureOpenAI.endpoint.title'),
        name: [LLMProviderConfigKey, providerKey, 'endpoint'],
      },
      {
        children: (
          <AutoComplete
            options={['2023-12-01-preview'].map((i) => ({
              label: i,
              value: i,
            }))}
            placeholder={'20XX-XX-XX'}
          />
        ),
        desc: (
          <Markdown className={styles.markdown}>
            {t('llm.AzureOpenAI.azureApiVersion.desc')}
          </Markdown>
        ),
        label: t('llm.AzureOpenAI.azureApiVersion.title'),
        name: [LLMProviderConfigKey, providerKey, 'apiVersion'],
      },
      {
        children: <Checker model={'gpt-3.5-turbo'} provider={ModelProvider.OpenAI} />,
        desc: t('llm.checker.desc'),
        label: t('llm.checker.title'),
        minWidth: undefined,
      },
    ],
    defaultActive: enabled,
    extra: (
      <Switch
        onChange={(enabled) => {
          toggleProviderEnabled(providerKey, enabled);
        }}
        value={enabled}
      />
    ),
    title: (
      <Flexbox align={'center'} gap={8} horizontal>
        <Azure.Combine size={24} type={'color'}></Azure.Combine>
        <Divider style={{ margin: '0 4px' }} type={'vertical'} />
        <OpenAI.Combine size={24}></OpenAI.Combine>
      </Flexbox>
    ),
  };

  return (
    <Form
      form={form}
      items={[openAI]}
      onValuesChange={debounce(setSettings, 100)}
      {...FORM_STYLE}
    />
  );
});

export default AzureOpenAIProvider;
