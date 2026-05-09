using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Common.Models;
using Nadasdladany.Application.Features.Documents.Commands;
using Nadasdladany.Application.Features.Documents.DTOs;
using Nadasdladany.Application.Features.Documents.Queries;

namespace Nadasdladany.Api.Controllers;

public class DocumentsController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedList<DocumentDto>>> GetDocuments([FromQuery] GetDocumentsWithPaginationQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<int>> Create([FromForm] CreateDocumentCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await Mediator.Send(new DeleteDocumentCommand(id));
        return NoContent();
    }
}