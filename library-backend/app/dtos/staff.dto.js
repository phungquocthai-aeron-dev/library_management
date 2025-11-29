class StaffDTO {
  constructor(staffDoc) {
    if (!staffDoc) return;

    this.id = staffDoc._id;
    this.fullName = staffDoc.fullName;
    this.role = staffDoc.role;
    this.address = staffDoc.address;
    this.phone = staffDoc.phone;
    this.isActive = staffDoc.isActive;
  }
}

module.exports = StaffDTO;
