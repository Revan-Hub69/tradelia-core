// Tradelia Components - Explicit Exports Only
// Following 2026 best practices: no wildcard exports to avoid cascading barrels
// Reference: Atlassian 75% faster builds by removing barrel files

// UI Primitives (Signature v1) - Explicit only
export { UiButton } from './ui/UiButton';
export { UiIconButton } from './ui/UiIconButton';
export { UiNavItem } from './ui/UiNavItem';
export { UiPanel } from './ui/UiPanel';
export { UiStatusChip } from './ui/UiStatusChip';
export { UiSurface } from './ui/UiSurface';

// Shadcn UI Components - Explicit only (avoid conflicts)
export { Alert, AlertDescription, AlertTitle } from './ui/alert';
export { Button } from './ui/button';
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
export { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from './ui/dropdown-menu';
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
export { Input } from './ui/input';
export { Label } from './ui/label';
export { Progress } from './ui/progress';
export { Separator } from './ui/separator';
export { Skeleton } from './ui/skeleton';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

// Icons
export type { IconName } from './icons';
export { DynamicIcon } from './icons';

// Standalone Components
export { ActiveLink } from './ActiveLink';
export { Background } from './Background';
export { LocaleSwitcher } from './LocaleSwitcher';
export { ToggleMenuButton } from './ToggleMenuButton';

// NOTE: For other components, use direct imports:
// import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
// import { SidebarNavigation } from '@/components/navigation/SidebarNavigation';
// This avoids cascading barrel files and improves build performance.
