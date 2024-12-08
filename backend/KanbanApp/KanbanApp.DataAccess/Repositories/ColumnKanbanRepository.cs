using KanbanApp.Core.Model;
using KanbanApp.DataAccess.Entites;
using KanbanApp.DataAccess;
using Microsoft.EntityFrameworkCore;

public class ColumnKanbanRepository : IColumnsKanbanRepository
{
	private readonly KanbanAppDbContext _context;

	public ColumnKanbanRepository(KanbanAppDbContext context)
	{
		_context = context;
	}

	public async Task<List<ColumnKanban>> Get()
	{
		var columnsEntities = await _context.Columns
			.AsNoTracking()
			.OrderBy(c => c.Order)
			.ToListAsync();

		var columns = columnsEntities
			.Select(c => ColumnKanban.Create(c.Id, c.Name, c.BoardId, c.Order).ColumnKanban)
			.ToList();
		return columns;
	}

	public async Task<Guid> Create(ColumnKanban columnKanban)
	{
		var columnEntity = new ColumnKanbanEntity
		{
			Id = columnKanban.Id,
			Name = columnKanban.Name,
			BoardId = columnKanban.BoardId,
			Order = columnKanban.Order,
		};
		await _context.Columns.AddAsync(columnEntity);
		await _context.SaveChangesAsync();
		return columnEntity.Id;
	}

	public async Task<Guid> Update(Guid id, string name, int order)
	{
		var columnEntity = await _context.Columns.FirstOrDefaultAsync(c => c.Id == id);

		if (columnEntity != null)
		{
			columnEntity.Name = name;
			columnEntity.Order = order;
			await _context.SaveChangesAsync();
		}

		return id;
	}

	public async Task<Guid> Delete(Guid id)
	{
		var columnEntity = await _context.Columns.FirstOrDefaultAsync(c => c.Id == id);

		if (columnEntity != null)
		{
			_context.Columns.Remove(columnEntity);
			await _context.SaveChangesAsync();
		}
		return id;
	}

	public async Task UpdateOrder(List<Guid> orderedColumnIds)
	{
		var columns = await _context.Columns.Where(c => orderedColumnIds.Contains(c.Id)).ToListAsync();

		for (int i = 0; i < orderedColumnIds.Count; i++)
		{
			var column = columns.FirstOrDefault(c => c.Id == orderedColumnIds[i]);
			if (column != null)
			{
				column.Order = i + 1;
			}
		}

		await _context.SaveChangesAsync();
	}

	public async Task<List<ColumnKanban>> GetByBoardId(Guid boardId)
	{
		var columnEntities = await _context.Columns
			.Where(c => c.BoardId == boardId)
			.OrderBy(c => c.Order)
			.AsNoTracking()
			.ToListAsync();

		var columns = columnEntities
			.Select(c => ColumnKanban.Create(c.Id, c.Name, c.BoardId, c.Order).ColumnKanban)
			.ToList();

		return columns;
	}
}
