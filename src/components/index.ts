// Tradelia Components - Explicit Exports Only
// Following 2026 best practices: no wildcard exports to avoid cascading barrels
// Reference: Atlassian 75% faster builds by removing barrel files

// UI Primitives (Signature v1) - Explicit only
export { UiSurface } from './ui/UiSurface';
export { UiButton } from './ui/UiButton';
export { UiIconButton } from './ui/UiIconButton';
export { UiNavItem } from './ui/UiNavItem';
export { UiPanel } from './ui/UiPanel';
export { UiStatusChip } from './ui/UiStatusChip';

// Shadcn UI Components - Explicit only (avoid conflicts)
export { Button } from './ui/button';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './ui/card';
export { Progress } from './ui/progress';
export { Separator } from './ui/separator';
export { Skeleton } from './ui/skeleton';
export { Alert, AlertTitle, AlertDescription } from './ui/alert';
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from './ui/dialog';
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup } from './ui/dropdown-menu';
export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from './ui/form';
export { Input } from './ui/input';
export { Label } from './ui/label';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip';

// Icons
export { DynamicIcon } from './icons';
export type { IconName } from './icons';

// Standalone Components
export { ActiveLink } from './ActiveLink';
export { LocaleSwitcher } from './LocaleSwitcher';
export { ToggleMenuButton } from './ToggleMenuButton';
export { Background } from './Background';

// NOTE: For other components, use direct imports:
// import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
// import { SidebarNavigation } from '@/components/navigation/SidebarNavigation';
// This avoids cascading barrel files and improves build performance.