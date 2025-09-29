import {
  type ComponentProps,
  type LegacyRef,
  type RefObject,
  createRef,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';
import { type IconType } from 'react-icons';
import { IoClose } from 'react-icons/io5';
import { RiInformationFill } from 'react-icons/ri';

import Button from './Button';
import Text from './Text';
import Stack from './Stack';
import { cn } from './../utilities';

const MAP_SIZE_CLASS = {
  xs: 'max-w-60',
  sm: 'max-w-xs',
  default: 'max-w-sm',
};

const MAP_SPAN_BG_COLOR_CLASS: Record<Intent, string> = {
  default: 'bg-brand',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

const MAP_FILLED_SPAN_BG_COLOR_CLASS: Record<Intent, string> = {
  default: 'bg-brand-active',
  success: 'bg-success-active',
  warning: 'bg-warning-active',
  danger: 'bg-danger-active',
};

const MAP_BUTTON_INTENT_CLASS: Record<Intent, string> = {
  default: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

const MAP_FILLED_BG_COLOR_CLASS: Record<Intent, string> = {
  default: 'bg-inverse',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

const MAP_ICON_COLOR_CLASS: Record<Intent, string> = {
  default: 'text-brand',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

const MAP_POSITION_CLASS = {
  'top-right': {
    container: 'place-items-end',
    toast: 'flex-col-reverse justify-end w-fit',
  },
  'top-left': {
    container: 'place-items-start',
    toast: 'flex-col-reverse justify-end w-fit',
  },
  'bottom-right': {
    container: 'place-items-end',
    toast: 'flex-col justify-end w-fit',
  },
  'bottom-left': {
    container: 'place-items-start',
    toast: 'flex-col justify-end w-fit',
  },
  'top-center': {
    container: 'place-items-center',
    toast: 'flex-col-reverse justify-end items-center w-full',
  },
  'bottom-center': {
    container: 'place-items-center',
    toast: 'flex-col justify-end items-center w-full',
  },
};

const DEFAULT_EAST_CUBIC = 'cubic-bezier(.36,.44,.05,1.15)';

const MAP_POSITION_ANIMATION = {
  'top-right': {
    entry: `animate-in slide-in-from-right-translate-full fade-in ease-[${DEFAULT_EAST_CUBIC}]`,
    exit: 'animate-out slide-out-to-right-translate-full fade-out ease-out',
  },
  'top-left': {
    entry: `animate-in slide-in-from-left-translate-full fade-in ease-[${DEFAULT_EAST_CUBIC}]`,
    exit: 'animate-out slide-out-to-left-translate-full fade-out ease-out',
  },
  'bottom-right': {
    entry: `animate-in slide-in-from-right-translate-full fade-in ease-[${DEFAULT_EAST_CUBIC}]`,
    exit: 'animate-out slide-out-to-right-translate-full fade-out ease-out',
  },
  'bottom-left': {
    entry: `animate-in slide-in-from-left-translate-full fade-in ease-[${DEFAULT_EAST_CUBIC}]`,
    exit: 'animate-out slide-out-to-left-translate-full fade-out ease-out',
  },
  'top-center': {
    entry: `animate-in slide-in-from-top-translate-full fade-in ease-[${DEFAULT_EAST_CUBIC}]`,
    exit: 'animate-out slide-out-from-top-translate-full fade-out ease-out zoom-out-90',
  },
  'bottom-center': {
    entry: `animate-in slide-in-from-bottom-translate-full fade-in ease-[${DEFAULT_EAST_CUBIC}]`,
    exit: 'animate-out slide-out-from-bottom-translate-full fade-out ease-out zoom-out-90',
  },
};

/**
 * Intent type for toast styling
 */
type Intent = Exclude<
  ComponentProps<typeof Button>['intent'],
  undefined | 'primary' | 'info' | 'inverse'
>;

/**
 * Toast component props
 * @typedef {Object} ToastProps
 * @property {number} id - Unique identifier for the toast
 * @property {string} title - Title displayed in the toast
 * @property {IconType} [icon] - Icon component to display
 * @property {Intent} [intent='default'] - Visual style of the toast ('default' | 'success' | 'warning' | 'danger')
 * @property {boolean} [filled=false] - Whether to use filled background styling
 * @property {string} [message] - Optional message content below the title
 * @property {number} [duration] - Auto-dismiss duration in milliseconds
 * @property {string} [timestamp] - Optional timestamp to display
 * @property {boolean} [isNewest=false] - Whether this is the newest toast (affects animations)
 * @property {boolean} [isExceeded=false] - Whether this toast exceeds the maximum limit
 * @property {keyof typeof MAP_SIZE_CLASS} [size='default'] - Size of the toast ('xs' | 'sm' | 'default')
 * @property {RefObject<HTMLDivElement | null>} ref - React ref for the toast element
 * @property {keyof typeof MAP_POSITION_CLASS} [position='top-right'] - Position of the toast
 * @property {() => void} [onClose] - Function called when toast is closed
 * @property {{ label: string, onClick?: () => void }} [action] - Optional action button configuration
 */
type ToastProps = {
  id: number;
  title: string;
  icon?: IconType;
  intent?: Intent;
  filled?: boolean;
  message?: string;
  duration?: number;
  timestamp?: string;
  isNewest?: boolean;
  isExceeded?: boolean;
  size?: keyof typeof MAP_SIZE_CLASS;
  ref: RefObject<HTMLDivElement | null>;
  position?: keyof typeof MAP_POSITION_CLASS;
  onClose?: () => void;
  action?: {
    label: string;
    onClick?: () => void;
  };
};

/**
 * Configuration options for creating a toast
 * @typedef {Object} ToastOptions
 */
type ToastOptions = Partial<
  Omit<ToastProps, 'id' | 'ref' | 'isExceeded' | 'isNewest'>
>;

/**
 * Input type for creating a toast - can be a simple string or configuration object
 * @typedef {string | (ToastOptions & { title: string })} ToastInput
 */
type ToastInput = string | (ToastOptions & { title: string });

/**
 * Global configuration for the toast system
 * @typedef {Object} ToastConfig
 * @property {number} maxToasts - Maximum number of toasts to display simultaneously
 * @property {number} duration - Default duration in milliseconds before auto-dismiss
 */
type ToastConfig = {
  maxToasts: number;
  duration: number;
};

const DEFAULT_CONFIG: ToastConfig = {
  maxToasts: 5,
  duration: 5000,
};

let nextId = 1;
let config: ToastConfig = DEFAULT_CONFIG;
const listerner = new Set<() => void>();

const initialToasts = Object.fromEntries(
  Object.keys(MAP_POSITION_CLASS).map((pos) => [pos, [] as ToastProps[]])
) as Record<keyof typeof MAP_POSITION_CLASS, ToastProps[]>;

const toastStore = {
  getConfig: () => config,
  setConfig: (newConfig: Partial<ToastConfig>) => {
    config = { ...config, ...newConfig };
  },
  toasts: initialToasts,
  addToast: (
    input: ToastInput,
    message?: string,
    options: ToastOptions = {}
  ) => {
    const isConfigObject = typeof input === 'object';
    const ref = createRef<HTMLDivElement>();
    const _position =
      typeof input === 'object' ? input.position : options.position;
    toastStore.enforceMaxToasts(_position);
    const newToast: ToastProps = {
      ref,
      id: nextId++,
      isExceeded: false,
      title: isConfigObject ? input.title : input,
      message: isConfigObject ? (input.message ?? '') : (message ?? ''),
      intent: isConfigObject ? input.intent : options.intent,
      duration: isConfigObject ? input.duration : options.duration,
      ...(isConfigObject ? input : options),
    };
    const position = newToast.position ?? 'top-right';
    const currentToasts = toastStore.toasts[position];

    toastStore.toasts = {
      ...toastStore.toasts,
      [position]: [...currentToasts, newToast],
    };

    toastStore.notifyListener();
  },
  notifyListener: () => {
    listerner.forEach((listener) => listener());
  },
  removeToast: async (id: number, position: ToastProps['position']) => {
    const currentToasts = toastStore.toasts[position ?? 'top-right'];
    const updatedToasts = currentToasts.filter((toast) => toast.id !== id);
    toastStore.toasts = {
      ...toastStore.toasts,
      [position ?? 'top-right']: updatedToasts,
    };

    await new Promise((resolve) => setTimeout(resolve, 400));
    toastStore.notifyListener();
  },
  enforceMaxToasts: (position: ToastProps['position']) => {
    const currentToasts = toastStore.toasts[position ?? 'top-right'];
    const maxAllowed = position?.includes('center') ? 1 : config.maxToasts;

    const updatedToasts = currentToasts.map((toast, index) => {
      if (index < currentToasts.length - (maxAllowed - 1)) {
        return { ...toast, isExceeded: true };
      }
      return {
        ...toast,
        isExceeded: false,
      };
    });

    toastStore.toasts = {
      ...toastStore.toasts,
      [position ?? 'top-right']: updatedToasts,
    };
    toastStore.notifyListener();

    currentToasts.forEach((toast) => {
      if (toast.isExceeded) {
        toastStore.removeToast(toast.id, toast?.position ?? 'top-right');
      }
    });
  },
};

const useToastStore = () => ({
  toasts: useSyncExternalStore(
    (listener) => {
      listerner.add(listener);
      return () => listerner.delete(listener);
    },
    () => toastStore.toasts
  ),
  removeToast: toastStore.removeToast,
  config: toastStore.getConfig(),
  setConfig: toastStore.setConfig,
  addToast: toastStore.addToast,
});

/**
 * Hook for managing toast notifications
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { toast } = useToast();
 *
 * // Simple text toast
 * toast('Success!');
 *
 * // With message and options
 * toast('Operation completed', 'Your file has been saved successfully', {
 *   intent: 'success',
 *   duration: 3000
 * });
 *
 * // Using configuration object
 * toast({
 *   title: 'Warning',
 *   message: 'Please check your input',
 *   intent: 'warning',
 *   action: {
 *     label: 'Retry',
 *     onClick: () => handleRetry()
 *   }
 * });
 *
 * // Custom configuration
 * const { toast } = useToast({ maxToasts: 3, duration: 2000 });
 * ```
 *
 * @param {Partial<ToastConfig>} [customConfig] - Custom configuration for toast behavior
 * @returns {{ toast: (input: ToastInput, message?: string, options?: ToastOptions) => void, removeToast: (id: number, position?: ToastProps['position']) => Promise<void> }} Object containing toast function and removeToast function
 */
const useToast = (customConfig?: Partial<ToastConfig>) => {
  const { setConfig, removeToast, addToast } = useToastStore();
  useMemo(() => {
    try {
      if (customConfig) {
        setConfig(customConfig);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error, ' here');
    }
  }, [customConfig, setConfig]);
  const toast = useCallback(
    (input: ToastInput, message?: string, options: ToastOptions = {}) => {
      addToast(input, message, options);
    },
    [addToast]
  );

  return { toast, removeToast };
};

/**
 * Individual Toast component for rendering a single toast notification
 *
 * @example
 * ```tsx
 * // Basic toast
 * <Toast
 *   id={1}
 *   title="Notification"
 *   ref={toastRef}
 * />
 *
 * // Success toast with action
 * <Toast
 *   id={2}
 *   title="File uploaded"
 *   message="Your document has been uploaded successfully"
 *   intent="success"
 *   filled={true}
 *   action={{
 *     label: "View",
 *     onClick: () => openFile()
 *   }}
 *   ref={toastRef}
 * />
 *
 * // Warning toast with custom duration
 * <Toast
 *   id={3}
 *   title="Connection unstable"
 *   message="Your internet connection seems unstable"
 *   intent="warning"
 *   duration={10000}
 *   timestamp="2 minutes ago"
 *   ref={toastRef}
 * />
 * ```
 *
 * @param {ToastProps} props - Component props
 * @param {string} props.title - Toast title
 * @param {number} props.id - Unique identifier
 * @param {RefObject<HTMLDivElement | null>} props.ref - React ref
 * @param {IconType} [props.icon=RiInformationFill] - Icon to display
 * @param {Intent} [props.intent='default'] - Visual style
 * @param {boolean} [props.filled=false] - Use filled background
 * @param {string} [props.message] - Optional message content
 * @param {number} [props.duration] - Auto-dismiss duration
 * @param {string} [props.timestamp] - Optional timestamp
 * @param {boolean} [props.isNewest=false] - Whether this is the newest toast
 * @param {boolean} [props.isExceeded=false] - Whether this toast exceeds the limit
 * @param {keyof typeof MAP_SIZE_CLASS} [props.size='default'] - Toast size
 * @param {keyof typeof MAP_POSITION_CLASS} [props.position='top-right'] - Toast position
 * @param {() => void} [props.onClose] - Close handler
 * @param {{ label: string, onClick?: () => void }} [props.action] - Optional action button
 */
function Toast({
  title,
  action,
  message,
  onClose,
  duration,
  timestamp,
  filled = false,
  isNewest = false,
  size = 'default',
  intent = 'default',
  position = 'top-right',
  isExceeded = false,
  icon: Icon = RiInformationFill,
}: ToastProps) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const propDuration = duration ?? config.duration ?? 5000;

  const [animationState, setAnimationState] = useState<'entry' | 'exit'>(
    'entry'
  );
  const [triggerDuration, setTriggerDuration] = useState(false);

  const NON_CENTER_ANIMATION = [
    isNewest && MAP_POSITION_ANIMATION[position].entry,
    animationState === 'exit' && MAP_POSITION_ANIMATION[position].exit,
    isExceeded ? 'opacity-0' : 'opacity-100',
  ].filter(Boolean);

  const CENTER_ANIMATION = [
    isNewest
      ? MAP_POSITION_ANIMATION[position].entry
      : MAP_POSITION_ANIMATION[position].exit,
    animationState === 'exit' && MAP_POSITION_ANIMATION[position].exit,
  ];

  return (
    <div
      className={cn(
        'fill-mode-forwards duration-400 scale-100 will-change-transform',
        'pointer-events-none z-[999999] flex w-screen bg-transparent px-mds-16 text',
        MAP_SIZE_CLASS[size],
        !position.includes('center') ? NON_CENTER_ANIMATION : CENTER_ANIMATION
      )}
      onAnimationStartCapture={() => {
        if (animationState === 'entry') {
          setTriggerDuration(true);
        }
      }}
    >
      <div
        className={cn(
          'toast-container relative',
          'w-full overflow-y-auto overscroll-contain md:max-h-32',
          'rounded-mds-8 bg-interface p-mds-16 shadow-md',
          filled && MAP_FILLED_BG_COLOR_CLASS[intent],
          !isExceeded ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <Stack>
          <Stack
            horizontal
            className="w-full"
            distribute="between"
            align="center"
          >
            <Stack gap="4">
              <Stack horizontal gap="8">
                <div
                  className={cn(
                    'flex',
                    filled ? 'text-light' : MAP_ICON_COLOR_CLASS[intent]
                  )}
                >
                  <div className="my-auto">
                    <Icon />
                  </div>
                </div>
                {title && (
                  <Text
                    size="body"
                    weight="medium"
                    color={`${filled ? 'light' : 'default'}`}
                  >
                    {title}
                  </Text>
                )}
              </Stack>
              {message && (
                <div className="flex flex-1 justify-between">
                  <div className="flex flex-1 flex-col gap-y-2">
                    <Text
                      size="caption"
                      lineHeight="tight"
                      color={`${filled ? 'light' : 'subtle'}`}
                    >
                      {message}
                    </Text>
                    {timestamp && (
                      <Text
                        size="caption"
                        lineHeight="tight"
                        color={filled ? 'inverse' : 'subtle'}
                      >
                        {timestamp}
                      </Text>
                    )}
                  </div>
                </div>
              )}
            </Stack>
            <Stack horizontal gap="12" className="min-h-[1.625rem]">
              {action && (
                <Button
                  onClick={() => {
                    action.onClick?.();
                  }}
                  variant="solid"
                  size="sm"
                  className="self-center capitalize"
                  intent={
                    filled
                      ? 'default'
                      : (MAP_BUTTON_INTENT_CLASS[intent] as Intent)
                  }
                >
                  {action.label}
                </Button>
              )}
              <button
                type="button"
                className={cn(filled && 'text-light')}
                onClick={() => {
                  setAnimationState('exit');
                  onCloseRef.current?.();
                }}
              >
                <IoClose />
              </button>
            </Stack>
          </Stack>
          <div
            key="progress-bar"
            className={cn(
              'absolute bottom-0 left-0 h-1 w-full origin-left',
              filled
                ? MAP_FILLED_SPAN_BG_COLOR_CLASS[intent]
                : MAP_SPAN_BG_COLOR_CLASS[intent],
              'transition-transform ease-linear',
              triggerDuration ? 'scale-x-0' : 'scale-100'
            )}
            style={{
              transitionDuration: !isExceeded ? `${propDuration}ms` : '100ms',
            }}
            onTransitionEndCapture={() => {
              if (animationState === 'entry') {
                setAnimationState('exit');
                onCloseRef.current?.();
              }
            }}
          />
        </Stack>
      </div>
    </div>
  );
}

/**
 * Portal component that renders all active toasts in their respective positions
 *
 * This component should be placed at the root level of your application to ensure
 * toasts are rendered above all other content.
 *
 * @example
 * ```tsx
 * // In your App.tsx or root component
 * function App() {
 *   return (
 *     <div className="app">
 *       {/* Your app content *\/}
 *       <ToastPortal />
 *     </div>
 *   );
 * }
 *
 * // Then use toasts anywhere in your component tree
 * function MyComponent() {
 *   const { toast } = useToast();
 *
 *   return (
 *     <button onClick={() => toast('Hello!')}>
 *       Show Toast
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns {ReactPortal[]} Array of portals containing toast elements
 */
function ToastPortal() {
  const { toasts, removeToast } = useToastStore();

  const positions = useRef<Map<number, DOMRect>>(new Map());
  const toastRefs = useRef<Map<number, RefObject<HTMLDivElement>>>(new Map());

  useLayoutEffect(() => {
    const newPositions = new Map<number, DOMRect>();
    const animations = new Set<Animation>();

    toastRefs.current.forEach((ref, id) => {
      if (ref?.current) {
        newPositions.set(id, ref.current.getBoundingClientRect());
      }
    });

    toastRefs.current.forEach((ref, id) => {
      const prev = positions.current.get(id);
      const current = newPositions.get(id);
      if (!prev || !current) return;
      const deltaY = prev.top - current.top;

      if (deltaY !== 0) {
        const el = ref.current;
        if (!el) return;

        el.getAnimations().forEach((animation) => animation.cancel());

        const animation = el.animate(
          [
            { transform: `translateY(${deltaY}px)` },
            { transform: 'translateY(0)' },
          ],
          {
            duration: 400,
            easing: 'cubic-bezier(0,-0.01,.65,1.35)',
            fill: 'forwards',
          }
        );

        animations.add(animation);
      }
    });

    positions.current = newPositions;

    return () => {
      animations.forEach((animation) => animation.cancel());
    };
  }, [toasts]);

  return Object.entries(toasts).map(([p, c]) => {
    const positionKey = p as keyof typeof MAP_POSITION_CLASS;
    const positionClass = MAP_POSITION_CLASS[positionKey];

    c.forEach((t) => {
      if (!toastRefs.current.has(t.id) && t.ref) {
        const ref = t.ref as RefObject<HTMLDivElement>;
        toastRefs.current.set(t.id, ref);
      }
    });

    if (c.length === 0) return null;
    return createPortal(
      <div
        key={p}
        className={cn(
          'pointer-events-none fixed inset-0 z-[999999] grid h-screen w-screen',
          positionClass.container
        )}
      >
        <div
          className={cn(
            'pointer-events-none',
            'relative h-screen',
            'flex gap-3 py-5',
            positionClass.toast
          )}
        >
          {c?.map((t, i) => {
            const isNewest = i === c.length - 1;
            return (
              <div key={t.id} ref={t.ref as LegacyRef<HTMLDivElement>}>
                <Toast
                  isNewest={isNewest}
                  {...t}
                  onClose={() => {
                    t?.onClose?.();
                    toastRefs.current.delete(t.id);
                    positions.current.delete(t.id);
                    removeToast(t.id, p as ToastProps['position']);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>,
      document.body
    );
  });
}

export { useToast, ToastPortal };
