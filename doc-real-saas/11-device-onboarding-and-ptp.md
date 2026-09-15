# Device Onboarding and PTP

This is the defining control loop of the product.

## The three separate permissions

1. **Personal Google login:** establishes which person is using the application.
2. **Company membership:** establishes which company that person may enter and their role there.
3. **PTP device approval:** establishes whether this particular device may perform protected attendance actions for that person in that company.

None of these replaces the others.

## Core scenario

1. An owner pays or begins an approved trial to create a company.
2. The owner invites a person using the email of their personal Google account.
3. The invited person installs/opens the application and signs in with that Google account.
4. The person accepts the company invitation.
5. The application marks the current device as Pending approval.
6. The owner or a delegated person with device-approval rights supplies or approves the PTP.
7. The company assigns attendance permissions to the approved device.
8. The member can clock in/out from that device according to its permissions.

## Additional-device scenario

Signing into another device with the same Google account restores identity and company membership, but not attendance-device permission. The new device repeats PTP onboarding. Approval of the new device does not automatically change existing devices.

## Device states

- **Pending:** member and company are known, but attendance actions are blocked.
- **Approved:** the device is recognized and has one or more company permissions.
- **Revoked:** previously approved, now blocked by an authorized company person.
- **Replaced/retired:** optional explanatory state for device history.

## Initial permissions

- Clock in
- Clock out

Open decision: grant these as one “Record attendance” permission or allow them separately. A single combined permission is simpler; separate permissions are only worthwhile if a real company workflow requires them.

## Company management view

An owner or authorized person should see:

- Member name and Google-account email
- Device label understandable to humans
- Pending, approved, or revoked state
- Attendance permissions granted
- Who approved or revoked the device and when
- Last attendance use, where appropriate
- Actions to approve, change permissions, or revoke

The view should not expose private information unrelated to identifying and managing the device.

## Member experience

The member should always understand:

- Which company is active
- Whether the current device is approved
- Which attendance actions are allowed
- Who can approve the device
- What to do if the PTP fails or the approver is unavailable
- Why another device requires separate approval

## Rules

- Approval is bound to one person, one company, and one device.
- Google login alone never authorizes attendance on a new device.
- Company membership alone never authorizes attendance on a new device.
- Approval in Company A never grants approval in Company B.
- Revoking a device does not delete attendance recorded from it.
- Deactivating a member blocks all that member’s devices in the company.
- Device and permission changes remain visible in company history.
- PTP failure never creates partial or unclear approval.

## PTP behavior still to decide

- Who or what generates the PTP?
- Is it entered by the member, entered by the approver, or confirmed by both?
- Is one PTP tied to a member, invitation, approval request, company, or device?
- Is it one-time or reusable?
- How long does it remain valid?
- Can approval be performed remotely?
- What prevents another person from using a screenshot or shared code?
- How is a lost, stolen, reset, or reinstalled device handled?
- Can an owner approve their own first device, and how?
- What happens if all approving devices are lost?

These details should be resolved through workflow design and misuse-case testing before the PTP behavior is considered complete.

## Why this supports revenue

The owner is paying for controlled company management: deciding who belongs, which devices may record attendance, who can approve devices, and maintaining trustworthy attendance history. PTP onboarding is therefore part of the paid management value—not an independent fee charged to employees.
