const publisherRepository = require("../repositories/publisher.repository");
const PublisherDTO = require("../dtos/publisher.dto");
const PublisherRepository = require("../repositories/publisher.repository");

class PublisherService {
  constructor(client) {
    this.publisherRepository = new PublisherRepository(client);
  }

  async getAll() {
    const publishers = await publisherRepository.findAll();
    return publishers.map((pub) => new PublisherDTO(pub));
  }

  async getById(id) {
    const publisher = await publisherRepository.findById(id);
    if (!publisher) throw new Error("Không tìm thấy nhà xuất bản");
    return new PublisherDTO(publisher);
  }

  async create(data) {
    const publisher = await publisherRepository.create(data);
    return new PublisherDTO(publisher);
  }

  async update(id, data) {
    await this.getById(id);
    const updated = await publisherRepository.update(id, data);
    return new PublisherDTO(updated);
  }

  async delete(id) {
    await this.getById(id);
    return await publisherRepository.delete(id);
  }
}

module.exports = PublisherService;
