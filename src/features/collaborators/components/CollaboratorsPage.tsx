import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Trash2, 
  Mail, 
  X, 
  ChevronDown,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrganization, useUser } from "@clerk/react";
import { toast } from "sonner";

export function CollaboratorsPage() {
  const { user } = useUser();
  const { 
    isLoaded, 
    organization, 
    memberships, 
    invitations 
  } = useOrganization({
    memberships: {
      pageSize: 10,
      keepPreviousData: true,
    },
    invitations: {
      pageSize: 10,
      keepPreviousData: true,
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"org:admin" | "org:member">("org:member");
  const [isInviting, setIsInviting] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // if (!organization) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
  //       <h2 className="text-xl font-semibold">No Organization Selected</h2>
  //       <p className="text-muted-foreground">Please select or create an organization to manage collaborators.</p>
  //     </div>
  //   );
  // }

  const handleInvite = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setIsInviting(true);
    try {
      await organization.inviteMember({
        emailAddress: email,
        role: role,
      });
      toast.success("Invitation sent successfully");
      setEmail("");
      invitations?.revalidate?.();
    } catch (error: any) {
      console.error("Failed to send invitation:", error);
      toast.error(error.errors?.[0]?.message || "Failed to send invitation");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (membershipId: string) => {
    const membership = memberships?.data?.find(m => m.id === membershipId);
    if (!membership) return;

    try {
      await membership.destroy();
      toast.success("Member removed successfully");
      memberships?.revalidate?.();
    } catch (error: any) {
      console.error("Failed to remove member:", error);
      toast.error(error.errors?.[0]?.message || "Failed to remove member");
    }
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    const invitation = invitations?.data?.find(i => i.id === invitationId);
    if (!invitation) return;

    try {
      await invitation.revoke();
      toast.success("Invitation revoked successfully");
      invitations?.revalidate?.();
    } catch (error: any) {
      console.error("Failed to revoke invitation:", error);
      toast.error(error.errors?.[0]?.message || "Failed to revoke invitation");
    }
  };

  const activeMembers = memberships?.data?.map(m => ({
    id: m.id,
    name: `${m.publicUserData.firstName || ""} ${m.publicUserData.lastName || ""}`.trim() || m.publicUserData.identifier,
    email: m.publicUserData.identifier,
    role: m.role === "org:admin" ? "ADMIN" : "MEMBER",
    status: "Active",
    avatar: m.publicUserData.imageUrl,
    isSelf: m.publicUserData.userId === user?.id
  })) || [];

  const pendingInvitations = invitations?.data?.map(i => ({
    id: i.id,
    name: "Pending Invitation",
    email: i.emailAddress,
    role: i.role === "org:admin" ? "ADMIN" : "MEMBER",
    status: "Pending",
    avatar: "",
    isSelf: false
  })) || [];

  const allCollaborators = [...activeMembers, ...pendingInvitations];

  const filteredCollaborators = allCollaborators.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-16 max-w-6xl mx-auto">
      {/* Invite Section */}
      <Card className="p-10 border shadow-[0px_1px_2px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(34,42,53,0.08)] rounded-[20px] bg-white">
        <div className="space-y-2 mb-10">
          <h2 className="text-[28px] font-semibold text-[#111111] tracking-tight leading-none">
            Invite Collaborator
          </h2>
          <p className="text-[15px] text-[#71717A] font-light leading-relaxed">
            Add a new member to your project to start collaborating on your ad campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-5 space-y-2.5">
            <Label htmlFor="email" className="text-sm font-semibold text-[#111111]">
              Email Address
            </Label>
            <Input
              id="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-white border-[#E4E4E7] rounded-xl px-4 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-black"
            />
          </div>
          <div className="md:col-span-3 space-y-2.5">
            <Label htmlFor="role" className="text-sm font-semibold text-[#111111]">
              Role
            </Label>
            <div className="relative">
              <select
                id="role"
                className="w-full h-12 bg-white border border-[#E4E4E7] rounded-xl px-4 appearance-none text-sm font-medium focus:outline-none focus:ring-1 focus:ring-black"
                value={role}
                onChange={(e) => setRole(e.target.value as "org:admin" | "org:member")}
              >
                <option value="org:member">Member</option>
                <option value="org:admin">Admin</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A] pointer-events-none" />
            </div>
          </div>
          <div className="md:col-span-4">
            <Button 
              onClick={handleInvite}
              disabled={isInviting}
              className="w-full h-12 bg-[#111111] hover:bg-black text-white rounded-xl font-semibold shadow-[0px_1px_2px_rgba(0,0,0,0.1),inset_0px_1px_0px_rgba(255,255,255,0.1)] transition-all"
            >
              {isInviting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Invitation"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Manage Section */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-[28px] font-semibold text-[#111111] tracking-tight leading-none">
              Manage Collaborators
            </h2>
            <p className="text-[15px] text-[#71717A] font-light leading-relaxed">
              You have {activeMembers.length} active collaborators in your team.
            </p>
          </div>
          <div className="relative w-full md:w-[360px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A1AA]" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10.5 h-11 border-[#E4E4E7] rounded-xl bg-white shadow-none focus-visible:ring-1 focus-visible:ring-black"
            />
          </div>
        </div>

        <Card className="overflow-hidden border shadow-[0px_4px_8px_rgba(0,0,0,0.02),0px_0px_0px_1px_rgba(34,42,53,0.08)] rounded-[20px] bg-white">
          <Table>
            <TableHeader className="bg-[#FAFAFA]/50 border-b">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="px-8 py-5 text-[11px] font-black text-[#71717A] tracking-[0.08em] uppercase">NAME</TableHead>
                <TableHead className="px-8 py-5 text-[11px] font-black text-[#71717A] tracking-[0.08em] uppercase">EMAIL</TableHead>
                <TableHead className="px-8 py-5 text-[11px] font-black text-[#71717A] tracking-[0.08em] uppercase">ROLE</TableHead>
                <TableHead className="px-8 py-5 text-[11px] font-black text-[#71717A] tracking-[0.08em] uppercase">STATUS</TableHead>
                <TableHead className="px-8 py-5 text-[11px] font-black text-[#71717A] tracking-[0.08em] uppercase text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollaborators.map((collaborator) => (
                <TableRow key={collaborator.id} className="hover:bg-gray-50/40 border-b last:border-0 transition-colors h-20">
                  <TableCell className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border shadow-sm">
                        <AvatarImage src={collaborator.avatar} className="object-cover" />
                        <AvatarFallback className="bg-[#F4F4F5] text-[11px] font-black text-[#71717A]">
                          {collaborator.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[15px] font-semibold text-[#111111] tracking-tight">
                        {collaborator.name} {collaborator.isSelf && "(You)"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-4">
                    <span className="text-[14px] text-[#71717A] font-medium italic">
                      {collaborator.email}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 py-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-[#F4F4F5] text-[#111111] border border-[#E4E4E7] tracking-wider">
                      {collaborator.role}
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        collaborator.status === "Active" ? "bg-[#10B981]" : "bg-[#F59E0B]"
                      )} />
                      <span className="text-[14px] text-[#71717A] font-medium italic">
                        {collaborator.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {collaborator.status === "Pending" ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 text-[#71717A] hover:text-[#111111] hover:bg-gray-100/50 rounded-lg"
                            title="Resend Invitation"
                          >
                            <Mail className="h-[18px] w-[18px]" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRevokeInvitation(collaborator.id)}
                            className="h-9 w-9 text-[#71717A] hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Revoke Invitation"
                          >
                            <X className="h-[18px] w-[18px]" />
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          disabled={collaborator.isSelf}
                          onClick={() => handleRemoveMember(collaborator.id)}
                          className="h-9 w-9 text-[#71717A] hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-30"
                          title="Remove Member"
                        >
                          <Trash2 className="h-[18px] w-[18px]" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCollaborators.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground font-light">
                    No collaborators found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Footer */}
          <div className="px-8 py-5 bg-white border-t flex items-center justify-between">
            <span className="text-[13px] text-[#71717A] font-light">
              Showing {filteredCollaborators.length} collaborators
            </span>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!memberships?.hasPreviousPage && !invitations?.hasPreviousPage}
                className="h-9 px-4 text-[13px] font-semibold rounded-xl border-[#E4E4E7] text-[#71717A] hover:bg-gray-50 bg-white"
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!memberships?.hasNextPage && !invitations?.hasNextPage}
                className="h-9 px-4 text-[13px] font-semibold rounded-xl border-[#E4E4E7] text-[#111111] hover:bg-gray-50 bg-white"
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
